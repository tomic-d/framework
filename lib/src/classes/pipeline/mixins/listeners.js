const PipelineListeners =
{
    OnCommit(callback)
    {
        const id = this.onetype.GenerateUID();

        this.listeners.commit[id] = callback;

        return id;
    },

    OffCommit(id)
    {
        delete this.listeners.commit[id];
        return this;
    },

    OnRollback(callback)
    {
        const id = this.onetype.GenerateUID();

        this.listeners.rollback[id] = callback;

        return id;
    },

    OffRollback(id)
    {
        delete this.listeners.rollback[id];
        return this;
    },

    OnJoin(callback)
    {
        const id = this.onetype.GenerateUID();

        this.listeners.join[id] = callback;

        return id;
    },

    OffJoin(id)
    {
        delete this.listeners.join[id];
        return this;
    }
};

export default PipelineListeners;
