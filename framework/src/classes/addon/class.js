// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

import AddonGet from './mixins/get.js';
import AddonStore from './mixins/store.js';
import AddonFields from './mixins/fields.js';
import AddonItems from './mixins/items.js';
import AddonRemove from './mixins/remove.js';
import AddonFunctions from './mixins/functions.js';
import AddonTable from './mixins/table.js';
import AddonFind from './mixins/find.js';
import AddonRender from './mixins/render.js';

class DivhuntAddon
{
    constructor(divhunt, name)
    {
        this.divhunt = divhunt;
        this.name = name;

        this.Store = {};

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

Object.assign(DivhuntAddon.prototype, AddonGet);
Object.assign(DivhuntAddon.prototype, AddonStore);
Object.assign(DivhuntAddon.prototype, AddonFields);
Object.assign(DivhuntAddon.prototype, AddonItems);
Object.assign(DivhuntAddon.prototype, AddonRemove);
Object.assign(DivhuntAddon.prototype, AddonFunctions);
Object.assign(DivhuntAddon.prototype, AddonTable);
Object.assign(DivhuntAddon.prototype, AddonFind);
Object.assign(DivhuntAddon.prototype, AddonRender);

export default DivhuntAddon;
