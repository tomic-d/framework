import DivhuntAddons from './mixins/addons.js';
import DivhuntGenerate from './mixins/generate.js';
import DivhuntRequest from './mixins/request.js';
import DivhuntData from './mixins/data.js';
import DivhuntBinaries from './mixins/binaries.js';
import DivhuntString from './mixins/string.js';
import DivhuntEmitter from './mixins/emitter.js';
import DivhuntMiddleware from './mixins/middleware.js';
import DivhuntLogger from './mixins/logger.js';
import DivhuntDependencies from './mixins/dependencies.js';
import DivhuntFunction from './mixins/function.js';
import DivhuntOverrides from './mixins/overrides.js';
import DivhuntDOM from './mixins/dom.js';
import DivhuntValidate from './mixins/validate.js';
import DivhuntHelper from './mixins/helper.js';
import DivhuntRoute from './mixins/route.js';
import DivhuntError from './mixins/error.js';
import DivhuntCrypto from './mixins/crypto.js';
import DivhuntForm from './mixins/form.js';

class Divhunt
{
    constructor()
    {
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
    }
}

Object.assign(Divhunt.prototype, DivhuntAddons);
Object.assign(Divhunt.prototype, DivhuntEmitter);
Object.assign(Divhunt.prototype, DivhuntGenerate);
Object.assign(Divhunt.prototype, DivhuntRequest);
Object.assign(Divhunt.prototype, DivhuntData);
Object.assign(Divhunt.prototype, DivhuntBinaries);
Object.assign(Divhunt.prototype, DivhuntString);
Object.assign(Divhunt.prototype, DivhuntMiddleware);
Object.assign(Divhunt.prototype, DivhuntLogger);
Object.assign(Divhunt.prototype, DivhuntDependencies);
Object.assign(Divhunt.prototype, DivhuntFunction);
Object.assign(Divhunt.prototype, DivhuntOverrides);
Object.assign(Divhunt.prototype, DivhuntDOM);
Object.assign(Divhunt.prototype, DivhuntValidate);
Object.assign(Divhunt.prototype, DivhuntHelper);
Object.assign(Divhunt.prototype, DivhuntRoute);
Object.assign(Divhunt.prototype, DivhuntError);
Object.assign(Divhunt.prototype, DivhuntCrypto);
Object.assign(Divhunt.prototype, DivhuntForm);

export default Divhunt;