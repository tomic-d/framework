import OneTypeAddon from '../classes/addon/class.js';

const OneTypeAddons =
{
    Addon(name, then = null, callback = true)
    {
        if(this.AddonGet(name))
        {
            return this.AddonGet(name, then);
        }
        else
        {
            return this.AddonAdd(name, then, callback);
        }
    },

    AddonAdd(name, then = null, callback = true)
    {
        name = name.toLowerCase();

        const addon = new OneTypeAddon(this, name);

        this.Emit('@addon.init', addon);

        this.addons.data[name] = addon;

        then && then(addon);

        if(callback)
        {
            this.addons.callbacks.add.forEach(callback =>
            {
                try
                {
                    callback(addon);
                }
                catch(error)
                {
                    this.Error(500, 'Error while performing addon add callback.', {addon: name});
                }
            });

            this.Emit('@addon.add', addon);
        }

        return this.AddonGet(name);
    },

    AddonGet(name, then = null)
    {
        name = name.toLowerCase();

        if(!(name in this.addons.data))
        {
            return null;
        }

        then && then(this.addons.data[name]);

        return this.addons.data[name];
    },

    Addons()
    {
        return this.addons.data;
    },

    AddonRemove(name, callback = true)
    {
        const addon = this.AddonGet(name);

        if(!addon)
        {
            return;
        }

        if(callback)
        {
            this.addons.callbacks.remove.forEach(callback =>
            {
                try
                {
                    callback(addon);
                }
                catch(error)
                {
                    this.Error(500, 'Error while performing addon remove callback.', {addon: name});
                }
            });

            this.Emit('@addon.remove', addon);
        }

        addon.ItemsRemove(callback);
        delete this.addons.data[name];
    },

    AddonsRemove(callback = true)
    {
        for(let name in this.addons.data)
        {
            this.AddonRemove(name, callback);
        }
    },

    AddonOn(name, callback)
    {
        if(!(name in this.addons.callbacks))
        {
            return this.Error(400, 'Addon catcher not found.', {addon: name});
        }

        this.addons.callbacks[name].push(callback);
    },

    AddonReady(name, callback)
    {
        const addon = this.AddonGet(name);

        if(addon)
        {
            return callback(addon);
        }

        this.AddonOn('add', (addon) =>
        {
            if(addon.GetName() === name)
            {
                callback(addon);
            }
        })
    }
};

export default OneTypeAddons;
