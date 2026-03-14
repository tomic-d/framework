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
                value = this.addon.onetype.DataDefineOne(value, field.define)
            }
            else if(any?.define)
            {
                value = this.addon.onetype.DataDefineOne(value, any.define)
            }
        }
        catch(error)
        {
            throw this.addon.onetype.Error(500, 'Error setting value on field :field:.', {field: key});
        }

        if(callback)
        {
            this.addon.items.callbacks.modify.forEach(callback => callback(this, key, value, prevValue));
            this.addon.onetype.Emit('@addon.item.modify', this, key, value, prevValue);
        }

        this.data[key] = value;

        if(callback)
        {
            this.addon.items.callbacks.modified.forEach(callback => callback(this, key, value, prevValue));
            this.addon.onetype.Emit('@addon.item.modified', this, key, value, prevValue);
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
