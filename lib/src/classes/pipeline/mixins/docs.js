const PipelineDocs =
{
    Schema()
    {
        return {
            name:        this.name,
            description: this.config.description,
            timeout:     this.config.timeout,
            in:          this.config.in,
            out:         this.config.out,
            listeners: {
                commit:   Object.keys(this.listeners.commit).length,
                rollback: Object.keys(this.listeners.rollback).length,
                join:     Object.keys(this.listeners.join).length
            },
            joins:       this.Joins().map(join => ({
                name:        join.name,
                order:       join.order,
                description: join.description,
                in:          join.in,
                out:         join.out,
                hooks: {
                    when:     !!join.when,
                    callback: !!join.callback,
                    commit:   !!join.commit,
                    rollback: !!join.rollback
                }
            }))
        };
    }
};

export default PipelineDocs;
