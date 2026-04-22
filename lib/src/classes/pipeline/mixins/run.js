const PipelineRun =
{
    async Run(properties = {}, context = {})
    {
        if(context.lock && !context.id)
        {
            return this._RunLocked(properties, context);
        }

        return this._RunWrapped(properties, context);
    },

    async _RunLocked(properties, context)
    {
        while(this.locks.has(context.lock))
        {
            await this.locks.get(context.lock);
        }

        let release;

        this.locks.set(context.lock, new Promise(resolve => { release = resolve; }));

        try
        {
            return await this._RunWrapped(properties, context);
        }
        finally
        {
            this.locks.delete(context.lock);
            release();
        }
    },

    async _RunWrapped(properties, context)
    {
        const nested = !!context.id;

        if(!this.config.wrap || context.wrap || nested)
        {
            return this._Run(properties, context);
        }

        let captured;

        try
        {
            await this.config.wrap(async (values = {}) =>
            {
                context.wrap = values;
                captured = await this._Run(properties, context);

                if(captured.code !== 200)
                {
                    throw this.onetype.Error(captured.code, captured.message);
                }
            });
        }
        catch(error)
        {
            if(!captured)
            {
                throw error;
            }
        }

        return captured;
    },

    async _Run(properties, context)
    {
        const trace  = this.onetype.GenerateUID();
        const parent = context.id ? context.id.trace : null;
        const root   = context.id ? context.id.root  : trace;

        const id = {trace, parent, root};

        const state = {
            id,
            started:  performance.now(),
            joins:    this.Joins(),
            executed: [],
            error:    null,
            trace:    null,
            entry:    null,
            deadline: this.config.timeout > 0 ? performance.now() + this.config.timeout : 0
        };

        state.trace = this._RunTrace(id, this.name);
        state.entry = {
            id,
            pipeline: this.name,
            status:   'running',
            started:  Date.now(),
            trace:    state.trace,
            children: []
        };

        this._RunRegister(state.entry, id);

        context.id       = id;
        context.log      = (message) => this._RunLog(state.trace, message);
        context.stop     = () => { state.stopped = true; };
        context.wrap     = context.wrap || {};
        context.state    = context.state || {};
        context.Pipeline = async (name, values = {}) =>
        {
            const inherited = {
                id:    context.id,
                wrap:  context.wrap,
                state: context.state
            };

            const result = await this.onetype.PipelineRun(name, values, inherited);

            if(result.code !== 200)
            {
                throw this.onetype.Error(result.code, result.message);
            }

            return result.data;
        };

        state.error = this._RunValidate(properties, this.config.in, null, 400, 'input');

        if(state.error)
        {
            return this._RunFinish(state, properties, context);
        }

        const total = state.joins.length;

        for(let i = 0; i < state.joins.length; i++)
        {
            const join = state.joins[i];
            const step = i + 1;

            if(state.deadline && performance.now() > state.deadline)
            {
                state.error = {
                    data:    null,
                    message: 'Pipeline :pipeline: timed out.'.replace(':pipeline:', this.name),
                    code:    408,
                    join:    join.name
                };
                break;
            }

            if(join.when && !(await this._RunWhen(join, properties, context, state.trace, step, total)))
            {
                continue;
            }

            state.executed.push(join);
            state.error = await this._RunJoin(join, properties, context, state.trace, state.deadline, step, total);

            if(state.error)
            {
                break;
            }

            if(state.stopped)
            {
                break;
            }
        }

        if(!state.error)
        {
            const merged = {...this.config.in, ...this.config.out};

            for(const join of Object.values(this.joins.data))
            {
                if(join.out)
                {
                    Object.assign(merged, join.out);
                }
            }

            state.error = this._RunValidate(properties, merged, null, 500, 'output');
        }

        if(state.error)
        {
            for(const join of [...state.executed].reverse())
            {
                await this._RunHook(join, 'rollback', state.trace.rollback, context, properties, state.error);
            }
        }
        else
        {
            for(const join of state.executed)
            {
                await this._RunHook(join, 'commit', state.trace.commit, context, properties);
            }
        }

        return this._RunFinish(state, properties, context);
    },

    _RunRegister(entry, id)
    {
        if(id.parent === null)
        {
            this.onetype.pipelines.running[id.root] = entry;
            return;
        }

        const tree = this.onetype.pipelines.running[id.root];

        if(!tree)
        {
            return;
        }

        const parent = this._RunFindEntry(tree, id.parent);

        if(parent)
        {
            parent.children.push(entry);
        }
    },

    _RunFindEntry(entry, trace)
    {
        if(!entry)
        {
            return null;
        }

        if(entry.id.trace === trace)
        {
            return entry;
        }

        for(const child of entry.children)
        {
            const found = this._RunFindEntry(child, trace);

            if(found)
            {
                return found;
            }
        }

        return null;
    },

    _RunTrace(id, pipeline)
    {
        return {
            id,
            pipeline,
            joins:    [],
            commit:   [],
            rollback: []
        };
    },

    _RunEntry(name, extra = {})
    {
        return {
            name,
            time:   '0.00',
            logs:   [],
            result: {data: null, code: 200, message: null},
            ...extra
        };
    },

    _RunClose(entry, started, error = null, data = null, message = null)
    {
        entry.time = (performance.now() - started).toFixed(2);

        if(error)
        {
            entry.result = {data: null, code: error.code, message: error.message};
        }
        else
        {
            entry.result = {data, code: 200, message};
        }

        return error;
    },

    _RunLog(trace, message)
    {
        const current = trace.joins[trace.joins.length - 1];

        if(current)
        {
            current.logs.push(String(message));
        }
    },

    _RunValidate(properties, config, join, code, label)
    {
        if(!config || Object.keys(config).length === 0)
        {
            return null;
        }

        try
        {
            this.onetype.DataDefine(properties, config, true);
            return null;
        }
        catch(error)
        {
            return {
                data:    error.message,
                message: ('Pipeline :pipeline: ' + label + ' is invalid.').replace(':pipeline:', this.name),
                code,
                join
            };
        }
    },

    _RunRequires(properties, requires, join, code)
    {
        for(const key of requires)
        {
            if(!(key in properties) || properties[key] === null || properties[key] === undefined)
            {
                return {
                    data:    null,
                    message: ('Pipeline :pipeline: join :name: requires :key:.').replace(':pipeline:', this.name).replace(':name:', join).replace(':key:', key),
                    code,
                    join
                };
            }
        }

        return null;
    },

    async _RunWhen(join, properties, context, trace, step, total)
    {
        try
        {
            const result = await join.when.call(context, properties);

            if(!result)
            {
                const entry = this._RunEntry(join.name, {order: join.order, step, total, keys: [], skipped: true});

                trace.joins.push(entry);
                this._RunFire('join', properties, join, entry);
            }

            return result;
        }
        catch(error)
        {
            const entry = this._RunEntry(join.name, {order: join.order, step, total, keys: [], result: {data: null, code: 500, message: error.message}});

            trace.joins.push(entry);
            this._RunFire('join', properties, join, entry);

            return false;
        }
    },

    async _RunJoin(join, properties, context, trace, deadline, step, total)
    {
        const started = performance.now();
        const entry   = this._RunEntry(join.name, {order: join.order, step, total, keys: []});
        const before  = Object.keys(properties);

        trace.joins.push(entry);

        const requires = this._RunRequires(properties, join.requires, join.name, 400);

        if(requires)
        {
            const closed = this._RunClose(entry, started, requires);
            this._RunFire('join', properties, join, entry);
            return closed;
        }

        const input = this._RunValidate(properties, join.in, join.name, 400, 'join input');

        if(input)
        {
            const closed = this._RunClose(entry, started, input);
            this._RunFire('join', properties, join, entry);
            return closed;
        }

        const response = await this._RunCallback(join, properties, context, deadline);

        if(response.code < 200 || response.code >= 300)
        {
            const closed = this._RunClose(entry, started, {...response, join: join.name});
            this._RunFire('join', properties, join, entry);
            return closed;
        }

        const merge = this._RunMerge(join, properties, response.data, before, entry);

        if(merge)
        {
            const closed = this._RunClose(entry, started, merge);
            this._RunFire('join', properties, join, entry);
            return closed;
        }

        const closed = this._RunClose(entry, started, null, response.data, response.message);

        this._RunFire('join', properties, join, entry);

        return closed;
    },

    _RunFire(type, context, ...args)
    {
        Object.values(this.listeners[type]).forEach(callback =>
        {
            Promise.resolve().then(() => callback.call(context, ...args)).catch(error =>
            {
                this.onetype.Error(500, 'Error in pipeline :pipeline: :type: listener.', {pipeline: this.name, type});
            });
        });
    },

    _RunCallback(join, properties, context, deadline)
    {
        return new Promise(async (resolve) =>
        {
            const callback = (data, message = null, code = 200) => resolve({data, message, code});

            let timer = null;

            if(deadline)
            {
                const remaining = deadline - performance.now();

                if(remaining <= 0)
                {
                    return resolve({
                        data:    null,
                        message: 'Pipeline :pipeline: timed out.'.replace(':pipeline:', this.name),
                        code:    408
                    });
                }

                timer = setTimeout(() =>
                {
                    resolve({
                        data:    null,
                        message: 'Pipeline :pipeline: timed out.'.replace(':pipeline:', this.name),
                        code:    408
                    });
                }, remaining);
            }

            try
            {
                if(join.callback)
                {
                    const returned = await join.callback.call(context, properties, callback);

                    resolve({data: returned ?? null, message: null, code: 200});
                }
                else
                {
                    resolve({data: null, message: null, code: 200});
                }
            }
            catch(error)
            {
                resolve({data: null, message: error.message, code: error.code || 500});
            }
            finally
            {
                if(timer)
                {
                    clearTimeout(timer);
                }
            }
        });
    },

    _RunMerge(join, properties, data, before, entry)
    {
        if(!data || typeof data !== 'object')
        {
            return null;
        }

        try
        {
            if(join.out && Object.keys(join.out).length > 0)
            {
                data = this.onetype.DataDefine(data, join.out, true);
            }
        }
        catch(error)
        {
            return {data: error.message, message: error.message, code: 500, join: join.name};
        }

        Object.assign(properties, data);
        entry.keys = Object.keys(properties).filter(key => !before.includes(key));

        return null;
    },

    async _RunHook(join, type, list, context, ...args)
    {
        if(!join[type])
        {
            return;
        }

        const started = performance.now();
        const entry   = this._RunEntry(join.name);

        list.push(entry);

        try
        {
            await join[type].call(context, ...args);
            this._RunClose(entry, started);
        }
        catch(error)
        {
            this._RunClose(entry, started, {code: error.code || 500, message: error.message});
            this.onetype.Error(500, 'Error in pipeline :pipeline: :type: :name:.', {pipeline: this.name, type, name: join.name});
        }
    },

    _RunFinish(state, properties, context)
    {
        state.entry.status = state.error ? 'failed'    : 'completed';
        state.entry.ended  = Date.now();

        if(state.id.parent === null)
        {
            delete this.onetype.pipelines.running[state.id.root];
        }

        const result = {
            id:      state.id,
            data:    state.error ? state.error.data : properties,
            message: state.error ? state.error.message : 'Pipeline :pipeline: executed successfully.'.replace(':pipeline:', this.name),
            code:    state.error ? state.error.code : 200,
            time:    (performance.now() - state.started).toFixed(2),
            trace:   state.trace
        };

        if(state.error)
        {
            this._RunFire('rollback', context, properties, state.error);
            this._RunEmit('rollback', context, result, properties, state.error);
        }
        else
        {
            this._RunFire('commit', context, properties);
            this._RunEmit('commit', context, result, properties);
        }

        this._RunEmit('run', context, result, properties);

        return result;
    },

    _RunEmit(type, context, ...args)
    {
        this.onetype.pipelines.callbacks[type].forEach(entry =>
        {
            if(entry.name !== null && entry.name !== this.name)
            {
                return;
            }

            try
            {
                entry.callback.call(context, this, ...args);
            }
            catch(error)
            {
                this.onetype.Error(500, 'Error in pipeline :pipeline: :type: callback.', {pipeline: this.name, type});
            }
        });

        this.onetype.Emit('@pipeline.' + type, this, ...args);
    }
};

export default PipelineRun;
