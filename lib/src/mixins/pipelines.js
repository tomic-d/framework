import OneTypePipeline from '../classes/pipeline/class.js';

const OneTypePipelines =
{
    Pipeline(name, config = {}, then = null, callback = true)
    {
        if(this.PipelineGet(name))
        {
            return this.PipelineGet(name, then);
        }
        else
        {
            return this.PipelineAdd(name, config, then, callback);
        }
    },

    PipelineAdd(name, config = {}, then = null, callback = true)
    {
        const pipeline = new OneTypePipeline(this, name, config);

        this.pipelines.data[name] = pipeline;

        then && then(pipeline);

        if(callback)
        {
            this.pipelines.callbacks.add.forEach(entry =>
            {
                if(entry.name !== null && entry.name !== pipeline.name)
                {
                    return;
                }

                try
                {
                    entry.callback(pipeline);
                }
                catch(error)
                {
                    this.Error(500, 'Error while performing pipeline add callback.', {pipeline: name});
                }
            });

            this.Emit('@pipeline.add', pipeline);
        }

        return this.PipelineGet(name);
    },

    PipelineGet(name, then = null)
    {
        if(!(name in this.pipelines.data))
        {
            return null;
        }

        then && then(this.pipelines.data[name]);

        return this.pipelines.data[name];
    },

    Pipelines()
    {
        return this.pipelines.data;
    },

    PipelineRemove(name, callback = true)
    {
        const pipeline = this.PipelineGet(name);

        if(!pipeline)
        {
            return;
        }

        if(callback)
        {
            this.pipelines.callbacks.remove.forEach(entry =>
            {
                if(entry.name !== null && entry.name !== pipeline.name)
                {
                    return;
                }

                try
                {
                    entry.callback(pipeline);
                }
                catch(error)
                {
                    this.Error(500, 'Error while performing pipeline remove callback.', {pipeline: name});
                }
            });

            this.Emit('@pipeline.remove', pipeline);
        }

        delete this.pipelines.data[name];
    },

    PipelinesRemove(callback = true)
    {
        Object.values(this.pipelines.data).forEach(pipeline =>
        {
            this.PipelineRemove(pipeline.name, callback);
        });
    },

    PipelineJoin(name, join, order = 0, config = {})
    {
        const pipeline = this.PipelineGet(name);

        if(!pipeline)
        {
            return this.Error(404, 'Pipeline :pipeline: not found.', {pipeline: name});
        }

        return pipeline.Join(join, order, config);
    },

    PipelineLeave(name, join)
    {
        const pipeline = this.PipelineGet(name);

        if(!pipeline)
        {
            return this.Error(404, 'Pipeline :pipeline: not found.', {pipeline: name});
        }

        return pipeline.Leave(join);
    },

    async PipelineRun(name, properties = {}, context = {})
    {
        const pipeline = this.PipelineGet(name);

        if(!pipeline)
        {
            return this.Error(404, 'Pipeline :pipeline: not found.', {pipeline: name});
        }

        return await pipeline.Run(properties, context);
    },

    PipelineTest(name, testName, config = {})
    {
        const pipeline = this.PipelineGet(name);

        if(!pipeline)
        {
            return this.Error(404, 'Pipeline :pipeline: not found.', {pipeline: name});
        }

        return pipeline.Test(testName, config);
    },

    async PipelineRunTest(name, testName)
    {
        const pipeline = this.PipelineGet(name);

        if(!pipeline)
        {
            return this.Error(404, 'Pipeline :pipeline: not found.', {pipeline: name});
        }

        return await pipeline.RunTest(testName);
    },

    async PipelineRunTests(name)
    {
        const pipeline = this.PipelineGet(name);

        if(!pipeline)
        {
            return this.Error(404, 'Pipeline :pipeline: not found.', {pipeline: name});
        }

        return await pipeline.RunTests();
    },

    async PipelineTests()
    {
        const pipelines = [];

        let passed = 0;
        let failed = 0;
        let total  = 0;

        for(const pipeline of Object.values(this.pipelines.data))
        {
            const result = await pipeline.RunTests();

            pipelines.push({name: pipeline.name, ...result});

            passed += result.passed;
            failed += result.failed;
            total  += result.total;
        }

        const percent = total ? Math.round(passed / total * 100) : 0;

        return {passed, failed, total, percent, pipelines};
    },

    PipelineSchema(name)
    {
        const pipeline = this.PipelineGet(name);

        if(!pipeline)
        {
            return this.Error(404, 'Pipeline :pipeline: not found.', {pipeline: name});
        }

        return pipeline.Schema();
    },

    PipelineRunning(id = null)
    {
        if(id === null)
        {
            return this.pipelines.running;
        }

        return this.pipelines.running[id] || null;
    },

    PipelineRunningFind(trace)
    {
        const walk = (entry) =>
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
                const found = walk(child);

                if(found)
                {
                    return found;
                }
            }

            return null;
        };

        for(const root of Object.values(this.pipelines.running))
        {
            const found = walk(root);

            if(found)
            {
                return found;
            }
        }

        return null;
    },

    PipelineOn(type, name, callback)
    {
        if(!(type in this.pipelines.callbacks))
        {
            return this.Error(400, 'Pipeline catcher not found.', {type});
        }

        this.pipelines.callbacks[type].push({name, callback});
    }
};

export default OneTypePipelines;
