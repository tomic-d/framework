import PipelineGet from './mixins/get.js';
import PipelineSet from './mixins/set.js';
import PipelineJoins from './mixins/joins.js';
import PipelineListeners from './mixins/listeners.js';
import PipelineRun from './mixins/run.js';
import PipelineDocs from './mixins/docs.js';
import PipelineTests from './mixins/tests.js';

class OneTypePipeline
{
    constructor(onetype, name, config = {})
    {
        this.onetype = onetype;
        this.name = name;

        this.config = onetype.DataDefine(config, {
            description: ['string', ''],
            in:       ['object|string', {}],
            out:      ['object|string', {}],
            timeout:  ['number', 120000],
            wrap:     ['function'],
            callback: ['function'],
            commit:   ['function'],
            rollback: ['function']
        });

        this.joins = {
            data: {}
        };

        this.listeners = {
            commit:   {},
            rollback: {},
            join:     {}
        };

        this.tests = {};

        this.locks = new Map();

        if(this.config.callback || this.config.commit || this.config.rollback)
        {
            this.Join('self', 0, {
                callback: this.config.callback,
                commit:   this.config.commit,
                rollback: this.config.rollback
            });
        }
    }
};

Object.assign(OneTypePipeline.prototype, PipelineGet);
Object.assign(OneTypePipeline.prototype, PipelineSet);
Object.assign(OneTypePipeline.prototype, PipelineJoins);
Object.assign(OneTypePipeline.prototype, PipelineListeners);
Object.assign(OneTypePipeline.prototype, PipelineRun);
Object.assign(OneTypePipeline.prototype, PipelineDocs);
Object.assign(OneTypePipeline.prototype, PipelineTests);

export default OneTypePipeline;
