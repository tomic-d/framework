// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

import AddonItemGet from './mixins/get.js';
import AddonItemSet from './mixins/set.js';
import AddonItemRemove from './mixins/remove.js';
import AddonItemFunctions from './mixins/functions.js';
import AddonItemCrud from './mixins/crud.js';
import AddonItemStore from './mixins/store.js';

class DivhuntAddonItem
{
    constructor(addon, data)
    {
        this.addon = addon;
        this.data = data;
        this.store = {};
    }
}

Object.assign(DivhuntAddonItem.prototype, AddonItemGet);
Object.assign(DivhuntAddonItem.prototype, AddonItemSet);
Object.assign(DivhuntAddonItem.prototype, AddonItemRemove);
Object.assign(DivhuntAddonItem.prototype, AddonItemFunctions);
Object.assign(DivhuntAddonItem.prototype, AddonItemCrud);
Object.assign(DivhuntAddonItem.prototype, AddonItemStore);

export default DivhuntAddonItem;
