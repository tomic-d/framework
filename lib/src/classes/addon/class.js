import AddonGet from './mixins/get.js';
import AddonStore from './mixins/store.js';
import AddonFields from './mixins/fields.js';
import AddonItems from './mixins/items.js';
import AddonRemove from './mixins/remove.js';
import AddonFunctions from './mixins/functions.js';
import AddonTable from './mixins/table.js';
import AddonFind from './mixins/find.js';
import AddonRender from './mixins/render.js';

class OneTypeAddon
{
    constructor(onetype, name)
    {
        this.onetype = onetype;
        this.name = name;

        this.store = {};

        this.table =
        {
            name: null,
            callbacks:
            {
                get: [],
                create: [],
                update: [],
                delete: []
            }
        };

        this.fields =
        {
            data: {},
            callbacks:
            {
                add: [],
                remove: []
            }
        };

        this.functions =
        {
            data: {},
            callbacks:
            {
                before: [],
                after: [],
                add: [],
                remove: []
            }
        };

        this.items =
        {
            data: {},
            map: {},
            id: 1,
            callbacks:
            {
                add: [],
                added: [],
                remove: [],
                removed: [],
                modify: [],
                modified: [],
                get: [],
                set: []
            }
        };
    }
};

Object.assign(OneTypeAddon.prototype, AddonGet);
Object.assign(OneTypeAddon.prototype, AddonStore);
Object.assign(OneTypeAddon.prototype, AddonFields);
Object.assign(OneTypeAddon.prototype, AddonItems);
Object.assign(OneTypeAddon.prototype, AddonRemove);
Object.assign(OneTypeAddon.prototype, AddonFunctions);
Object.assign(OneTypeAddon.prototype, AddonTable);
Object.assign(OneTypeAddon.prototype, AddonFind);
Object.assign(OneTypeAddon.prototype, AddonRender);

export default OneTypeAddon;
