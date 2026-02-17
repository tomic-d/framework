// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

const AddonItemSet =
{
    Set(key, value, callback = true)
    {
        const field = this.addon.FieldGet(key);
        const any = this.addon.FieldGet('*');

        if(!field && !any)
        {
            return;
        }

        const prevValue = this.data[key];

        field?.set?.forEach(callback =>
        {
            value = callback(value, prevValue, this);
        });

        any?.set?.forEach(callback =>
        {
            value = callback(value, prevValue, this);
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
            throw new Error('Error setting value on field ' + key + '. ' + error.message)
        }

        if(callback)
        {
            this.addon.items.callbacks.modify.forEach(callback => callback(this, key, value, prevValue));
            this.addon.items.callbacks.set.forEach(callback => callback(this, key, value));
            this.addon.divhunt.Emit('addon.item.modify', this, key, value, prevValue);
            this.addon.divhunt.Emit('addon.item.set', this, key, value, prevValue);
        }

        this.data[key] = value;

        if(callback)
        {
            this.addon.items.callbacks.modified.forEach(callback => callback(this, key, value, prevValue));
            this.addon.divhunt.Emit('addon.item.modified', this, key, value, prevValue);
        }
    },

    SetData(data, callback = true)
    {
        Object.entries(data).forEach(([key, value]) =>
        {
            this.Set(key, value, callback);
        })
    }
};

export default AddonItemSet;
