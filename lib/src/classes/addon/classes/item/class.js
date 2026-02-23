import AddonItemGet from './mixins/get.js';
import AddonItemSet from './mixins/set.js';
import AddonItemRemove from './mixins/remove.js';
import AddonItemFunctions from './mixins/functions.js';
import AddonItemCrud from './mixins/crud.js';
import AddonItemStore from './mixins/store.js';

class OneTypeAddonItem
{
    constructor(addon, data)
    {
        this.addon = addon;
        this.data = data;
        this.store = {};
    }
}

Object.assign(OneTypeAddonItem.prototype, AddonItemGet);
Object.assign(OneTypeAddonItem.prototype, AddonItemSet);
Object.assign(OneTypeAddonItem.prototype, AddonItemRemove);
Object.assign(OneTypeAddonItem.prototype, AddonItemFunctions);
Object.assign(OneTypeAddonItem.prototype, AddonItemCrud);
Object.assign(OneTypeAddonItem.prototype, AddonItemStore);

export default OneTypeAddonItem;
