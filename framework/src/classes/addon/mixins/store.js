// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

import divhunt from "#framework/load.js";

const AddonStore =
{
    StoreGet(key, value = undefined)
    {
        if(key === undefined)
        {
            return this.Store;
        }

        if(value !== undefined)
        {
            return divhunt.DataDefineOne(this.Store[key], [typeof value]);
        }

        return this.Store[key];
    },

    StoreSet(key, value)
    {
        if(typeof key === 'object')
        {
            Object.assign(this.Store, key);
            return this;
        }

        this.Store[key] = value;
        return this;
    },

    StoreHas(key)
    {
        return key in this.Store;
    },

    StoreDelete(key)
    {
        delete this.Store[key];
        return this;
    },

    StoreClear()
    {
        this.Store = {};
        return this;
    }
};

export default AddonStore;