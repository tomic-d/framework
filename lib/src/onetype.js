import OneTypeAddons from './mixins/addons.js';
import OneTypeGenerate from './mixins/generate.js';
import OneTypeRequest from './mixins/request.js';
import OneTypeData from './mixins/data.js';
import OneTypeBinaries from './mixins/binaries.js';
import OneTypeString from './mixins/string.js';
import OneTypeEmitter from './mixins/emitter.js';
import OneTypeMiddleware from './mixins/middleware.js';
import OneTypeDependencies from './mixins/dependencies.js';
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

class OneType
{
    constructor()
    {
        this.environment = typeof window !== 'undefined' ? 'front' : 'back';
        this.emitters = {};
        this.middleware = {};

        this.addons =
        {
            data: {},
            callbacks:
            {
                add: [],
                remove: []
            }
        };

        this.dependencies = {
            items: {},
            callbacks: {
                add: [],
                remove: []
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
            set: (key, value) => this.StateSet(key, value)
        };

        this.ObserverStart();
    }
}

Object.assign(OneType.prototype, OneTypeAddons);
Object.assign(OneType.prototype, OneTypeEmitter);
Object.assign(OneType.prototype, OneTypeGenerate);
Object.assign(OneType.prototype, OneTypeRequest);
Object.assign(OneType.prototype, OneTypeData);
Object.assign(OneType.prototype, OneTypeBinaries);
Object.assign(OneType.prototype, OneTypeString);
Object.assign(OneType.prototype, OneTypeMiddleware);
Object.assign(OneType.prototype, OneTypeDependencies);
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

export default OneType;