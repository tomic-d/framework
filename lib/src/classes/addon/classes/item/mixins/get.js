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
                value = this.addon.onetype.DataDefineOne(value, field.define)
            }
            else if(any?.define)
            {
                value = this.addon.onetype.DataDefineOne(value, any.define)
            }
        }
        catch(error)
        {
            throw this.addon.onetype.Error(500, 'Error getting value on field :field:.', {field: key});
        }

        if(callback)
        {
            this.addon.items.callbacks.get.forEach(callback =>
            {
                try
                {
                    callback(this, key, value);
                }
                catch(error)
                {
                    this.addon.onetype.Error(500, 'Error in item get callback.');
                }
            });
            
            this.addon.onetype.Emit('@addon.item.get', this, key, value);
        }

        return value;
    },

    GetData(callback = true)
    {
        let data = {};

        Object.keys(this.data).forEach((key) =>
        {
            data[key] = this.Get(key, callback);
        })

        return data;
    }
};

export default AddonItemGet;
