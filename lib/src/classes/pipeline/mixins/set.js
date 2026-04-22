const PipelineSet =
{
    SetConfig(config)
    {
        this.config = this.onetype.DataDefine({...this.config, ...config}, {
            description: ['string', ''],
            in:       ['object', {}],
            out:      ['object', {}],
            timeout:  ['number', 120000],
            callback: ['function'],
            commit:   ['function'],
            rollback: ['function']
        });

        return this;
    }
};

export default PipelineSet;
