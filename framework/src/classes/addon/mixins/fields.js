// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

const AddonFields =
{
    Field(name, define = null, get = null, set = null, map = false, callback = true)
    {
        const field = this.FieldGet(name);

        if(field)
        {
            return field;
        }

        return this.FieldAdd(name, define, get, set, map, callback);
    },

    Fields()
    {
        return this.fields;
    },

    FieldAdd(name, define = null, get = null, set = null, map = false, callback = true)
    {
        if(!(name in this.fields.data))
        {
            this.fields.data[name] = {name, define: null, get: [], set: [], map};
        }

        if(map)
        {
            if(!(name in this.items.map))
            {
                this.items.map = {};
            }

            this.items.map[name] = {};
        }

        if(define !== null) { this.fields.data[name].define = define; }
        if(get !== null)    { this.fields.data[name].get.push(get); }
        if(set !== null)    { this.fields.data[name].set.push(set); }

        if(callback)
        {
            this.fields.callbacks.add.forEach(callback => callback.call(this, this.fields.data[name]));
            this.divhunt.Emit('addon.field.add', this, this.fields.data[name]);
        }

        return this.fields.data[name];
    },

    FieldGet(name)
    {
        return this.fields.data[name];
    },

    FieldRemove(name, callback = true)
    {
        if(!(name in this.fields))
        {
            return;
        }

        if(callback)
        {
            this.fields.callbacks.remove.forEach(callback => callback.call(this, this.fields.data[name]));
            this.divhunt.Emit('addon.field.remove', this, this.fields.data[name]);
        }

        delete this.fields.data[name];
    },

    FieldOn(type, callback)
    {
        if(!(type in this.fields.callbacks))
        {
            this.LogWarn('Field catcher not found.', {name});
            return this;
        }

        this.fields.callbacks[type].push(callback);
    }
};

export default AddonFields;
