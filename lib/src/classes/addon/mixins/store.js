import onetype from "#framework/load.js";

const AddonStore =
{
    StoreGet(key, value = undefined)
    {
        if(key === undefined)
        {
            return this.store;
        }

        if(value !== undefined)
        {
            return onetype.DataDefineOne(this.store[key], [typeof value]);
        }

        return this.store[key];
    },

    StoreSet(key, value)
    {
        if(typeof key === 'object')
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

    StoreDelete(key)
    {
        delete this.store[key];
        return this;
    },

    StoreClear()
    {
        this.store = {};
        return this;
    }
};

export default AddonStore;