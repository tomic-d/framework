// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

const AddonItemGet =
{
    Get(key, callback = true)
    {
        if(Array.isArray(key))
        {
            const data = {};

            key.forEach((k) => 
            {
                data[k] = this.Get(k, callback);
            });

            return data;
        }

        const field = this.addon.FieldGet(key);
        const any = this.addon.FieldGet('*');

        if(!field && !any && key !== 'id')
        {
            return null;
        }

        let value = this.data[key];

        field?.get.forEach(callback =>
        {
            value = callback(value, this);
        });

        any?.get.forEach(callback =>
        {
            value = callback(value, this);
        });


        try 
        {
            if(field?.define)
            {
                value = this.addon.divhunt.DataDefineOne(value, field.define)
            }
            else if(any?.define)
            {
                value = this.addon.divhunt.DataDefineOne(value, any.define)
            }
        }
        catch(error)
        {
            throw new Error('Error getting value on field ' + key + '. ' + error.message)
        }

        if(callback)
        {
            this.addon.items.callbacks.get.forEach(callback => callback(this, key, value));
            this.addon.divhunt.Emit('addon.item.get', this, key, value);
        }

        return value;
    },

    GetData(callback = true)
    {
        let data = {};

        Object.entries(data).forEach(([key, value]) =>
        {
            data[key] = this.Get(key, callback);
        })

        return data;
    }
};

export default AddonItemGet;
