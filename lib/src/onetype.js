import OneTypeAddons from './mixins/addons.js';
import OneTypeGenerate from './mixins/generate.js';
import OneTypeRequest from './mixins/request.js';
import OneTypeData from './mixins/data.js';
import OneTypeBinaries from './mixins/binaries.js';
import OneTypeString from './mixins/string.js';
import OneTypeEmitter from './mixins/emitter.js';
import OneTypeMiddleware from './mixins/middleware.js';
import OneTypeLogger from './mixins/logger.js';
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

        this.logger =
        {
            levels:
            {
                error: 0,
                warn: 1,
                info: 2,
                http: 3,
                verbose: 4,
                debug: 5,
                silly: 6
            },
            level: 'error'
        };

        this.data =
        {
            schemas: {},
        };

        this.$ot = {};
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
Object.assign(OneType.prototype, OneTypeLogger);
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

export default OneType;