const PipelineJoins =
{
    Join(name, order = 0, config = {})
    {
        config = this.onetype.DataDefine(config, {
            description: ['string', ''],
            in:          ['object|string', {}],
            out:         ['object|string', {}],
            requires:    ['array', []],
            when:        ['function'],
            callback:    ['function'],
            commit:      ['function'],
            rollback:    ['function']
        });

        const join = {
            name,
            order,
            description: config.description,
            in:       config.in,
            out:      config.out,
            requires: config.requires,
            when:     config.when,
            callback: config.callback,
            commit:   config.commit,
            rollback: config.rollback
        };

        this.joins.data[name] = join;

        this.onetype.pipelines.callbacks.join.forEach(entry =>
        {
            if(entry.name !== null && entry.name !== this.name)
            {
                return;
            }

            try
            {
                entry.callback(this, join);
            }
            catch(error)
            {
                this.onetype.Error(500, 'Error in pipeline :pipeline: join :name: callback.', {pipeline: this.name, name});
            }
        });

        this.onetype.Emit('@pipeline.join', this, join);

        return this;
    },

    Leave(name)
    {
        const join = this.joins.data[name];

        if(!join)
        {
            return this;
        }

        delete this.joins.data[name];

        this.onetype.pipelines.callbacks.leave.forEach(entry =>
        {
            if(entry.name !== null && entry.name !== this.name)
            {
                return;
            }

            try
            {
                entry.callback(this, join);
            }
            catch(error)
            {
                this.onetype.Error(500, 'Error in pipeline :pipeline: leave :name: callback.', {pipeline: this.name, name});
            }
        });

        this.onetype.Emit('@pipeline.leave', this, join);

        return this;
    },

    JoinGet(name)
    {
        return this.joins.data[name] || null;
    },

    Joins()
    {
        return Object.values(this.joins.data).sort((a, b) => a.order - b.order);
    }
};

export default PipelineJoins;
