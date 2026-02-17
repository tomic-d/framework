// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

const AddonItemStore =
{
    StoreGet(key, value = undefined)
    {
        if(key === undefined)
        {
            return this.store;
        }

        if(value !== undefined)
        {
            return divhunt.DataDefineOne(this.store[key], [typeof value]);
        }

        return this.store[key];
    },

    StoreSet(key, value)
    {
        if(typeof key === 'object' && key !== null && value === undefined)
        {
            Object.assign(this.store, key);
            return this;
        }

        this.store[key] = value;
        return this;
    },

    StoreHas(key)
    {
        return key in this.store;
    },

    StoreRemove(key)
    {
        if(Array.isArray(key))
        {
            key.forEach(k => delete this.store[k]);
        }
        else
        {
            delete this.store[key];
        }
        
        return this;
    },

    StoreClear()
    {
        this.store = {};
        return this;
    }
};

export default AddonItemStore;