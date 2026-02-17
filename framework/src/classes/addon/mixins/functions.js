// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

const AddonFunctions =
{
    FnAdd(name, callback)
    {
        if(typeof name === 'object')
        {
            Object.entries(name).forEach(([key, value]) => this.FnAdd(key, value));
            return this;
        }

        name = name.toLowerCase();

        if (typeof callback !== 'function')
        {
            this.divhunt.LogWarn('Function "' + name + '" callback is not a function.');
            return this;
        }

        this.functions.data[name] = {callback, name};

        try
        {
            this.functions.callbacks.add.forEach(callback => callback.call(this, this.functions.data[name]));
            this.divhunt.Emit('addon.function.add', name);
        }
        catch(error)
        {
            this.divhunt.LogError('Error in function "' + name + '" callback add.', {}, error);
        }

        return this;
    },

    FnGet(name)
    {
        name = name.toLowerCase();
        return this.functions.data[name] || null;
    },

    FnRun(name, ...data)
    {
        name = name.toLowerCase();

        const fn = this.FnGet(name);

        if (!fn)
        {
            this.divhunt.LogError('Function not found.', {name});
            return null;
        }

        let response = null;

        const context = Object.create(this);
        context.methods = {};

        try
        {
            this.functions.callbacks.before.forEach(callback => callback.call(context, fn, ...data));
            this.divhunt.Emit('addon.function.before', this, fn, response, ...data);
        }
        catch(error)
        {
            this.divhunt.LogError('Error in function callback before.', {name}, error);
        }
       
        response = fn.callback.call(context, ...data);

        try
        {
            this.functions.callbacks.after.forEach(callback => callback.call(context, fn, response, ...data));
            this.divhunt.Emit('addon.function.after', context, fn, response, ...data);
        }
        catch(error)
        {
            this.divhunt.LogError('Error in function callback after.', {name}, error);
        }

        return response;
    },
    
    FnRemove(name)
    {
        const fn = this.FnGet(name);

        if (!fn)
        {
            return this;
        }

        try
        {
            this.functions.callbacks.remove.forEach(callback => callback.call(this, fn));
            this.divhunt.Emit('addon.function.remove', this, fn);
        }
        catch(error)
        {
            this.divhunt.LogError('Error in function callback remove.', {name: fn.name}, error);
        }

        delete this.functions.data[fn.name];

        return this;
    },

    FnOn(type, callback)
    {
        if(!(type in this.functions.callbacks))
        {
            return this.LogWarn('Item catcher not found.', {type});
        }

        this.functions.callbacks[type].push(callback);
    },

    Fn(name, ...data)
    {
        if(!this.FnGet(name) && data.length && typeof data[0] === 'function')
        {
            return this.FnAdd(name, ...data);
        }
        else
        {
            return this.FnRun(name, ...data);
        }
    }
};

export default AddonFunctions;
