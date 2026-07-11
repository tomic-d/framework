import OneTypeAddons from './mixins/addons.js';
import OneTypePipelines from './mixins/pipelines.js';
import OneTypeGenerate from './mixins/generate.js';
import OneTypeRequest from './mixins/request.js';
import OneTypeData from './mixins/data.js';
import OneTypeBinaries from './mixins/binaries.js';
import OneTypeString from './mixins/string.js';
import OneTypeEmitter from './mixins/emitter.js';
import OneTypeMiddleware from './mixins/middleware.js';
import OneTypeFunction from './mixins/function.js';
import OneTypeOverrides from './mixins/overrides.js';
import OneTypeDOM from './mixins/dom.js';
import OneTypeValidate from './mixins/validate.js';
import OneTypeHelper from './mixins/helper.js';
import OneTypeRoute from './mixins/route.js';
import OneTypeError from './mixins/error.js';
import OneTypeCrypto from './mixins/crypto.js';
import OneTypeForm from './mixins/form.js';
import OneTypeCookie from './mixins/cookie.js';
import OneTypeState from './mixins/state.js';
import OneTypeAssets from './mixins/assets.js';
import OneTypeObserver from './mixins/observer.js';
import OneTypeMarkdown from './mixins/markdown.js';
import OneTypeBase from './mixins/base.js';
import OneTypeLanguage from './mixins/language.js';
import OneTypeLocale from './mixins/locale.js';

class OneType
{
    constructor()
    {
        this.environment = typeof window !== 'undefined' ? 'front' : 'back';

        if(this.environment === 'back')
        {
            this.OverrideLog();
        }

        this.emitters = {
            data: {},
            callbacks: {}
        };

        this.middlewares = {
            data: {},
            callbacks: {}
        };

        this.addons =
        {
            data: {},
            callbacks:
            {
                add: [],
                remove: []
            }
        };

        this.pipelines =
        {
            data: {},
            running: {},
            callbacks:
            {
                add: [],
                remove: [],
                run: [],
                commit: [],
                rollback: [],
                join: [],
                leave: []
            }
        };

        this.data =
        {
            schemas: {},
        };

        this.assets = {};

        this.$ot =
        {
            get: (key, value = undefined) => this.StateGet(key, undefined),
            set: (key, value) => this.StateSet(key, value),
            t: (text, key) => this.LocaleGet(text, key),
            pipeline: async (name, properties = {}, context = {}) =>
            {
                const result = await this.PipelineRun(name, properties, context);

                if(result.code !== 200)
                {
                    throw this.Error(result.code, result.message);
                }

                return result.data;
            }
        };

        this.ObserverStart();
    }
}

Object.assign(OneType.prototype, OneTypeAddons);
Object.assign(OneType.prototype, OneTypePipelines);
Object.assign(OneType.prototype, OneTypeEmitter);
Object.assign(OneType.prototype, OneTypeGenerate);
Object.assign(OneType.prototype, OneTypeRequest);
Object.assign(OneType.prototype, OneTypeData);
Object.assign(OneType.prototype, OneTypeBinaries);
Object.assign(OneType.prototype, OneTypeString);
Object.assign(OneType.prototype, OneTypeMiddleware);
Object.assign(OneType.prototype, OneTypeFunction);
Object.assign(OneType.prototype, OneTypeOverrides);
Object.assign(OneType.prototype, OneTypeDOM);
Object.assign(OneType.prototype, OneTypeValidate);
Object.assign(OneType.prototype, OneTypeHelper);
Object.assign(OneType.prototype, OneTypeRoute);
Object.assign(OneType.prototype, OneTypeError);
Object.assign(OneType.prototype, OneTypeCrypto);
Object.assign(OneType.prototype, OneTypeForm);
Object.assign(OneType.prototype, OneTypeCookie);
Object.assign(OneType.prototype, OneTypeState);
Object.assign(OneType.prototype, OneTypeAssets);
Object.assign(OneType.prototype, OneTypeObserver);
Object.assign(OneType.prototype, OneTypeMarkdown);
Object.assign(OneType.prototype, OneTypeBase);
Object.assign(OneType.prototype, OneTypeLanguage);
Object.assign(OneType.prototype, OneTypeLocale);

export default OneType;