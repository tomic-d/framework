// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

import DivhuntAddon from '../classes/addon/class.js';

const DivhuntAddons =
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

        const addon = new DivhuntAddon(this, name);

        this.addons.data[name] = addon;

        then && then(addon);

        if(callback)
        {
            try
            {
                this.addons.callbacks.add.forEach(callback => callback(addon));
                this.Emit('addon.add', addon);
            }
            catch(error)
            {
                this.LogError('Error while performing addon add callback.', {addon: name}, error);
            }
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
            try
            {
                this.addons.callbacks.remove.forEach(callback => callback(addon));
                this.Emit('addon.remove', addon);
            }
            catch(error)
            {
                this.LogError('Error while performing addon remove callback.', {addon: name}, error);
            }
        }

        addon.ItemsRemove(callback);
        delete this.addons.items[name];
    },

    AddonsRemove(callback = true)
    {
        for(let name in this.addons.items)
        {
            this.AddonRemove(name, callback);
        }
    },

    AddonOn(name, callback)
    {
        if(!(name in this.addons.callbacks))
        {
            return this.LogWarn('Addon catcher not found.', {addon: name});
        }

        this.addons.callbacks[name].push(callback);
    },

    AddonReady(name, callback, instant = false)
    {
        const addon = this.AddonGet(name);

        if(addon)
        {
            if(instant)
            {
                return callback(addon);
            }

            return setTimeout(() => callback(addon));
        }

        let loaded = false;

        const timeout = setTimeout(() =>
        {
            if(!loaded)
            {
                this.LogWarn(`Addon "${name}" might not be loaded.`);
            }
        }, 2000);

        this.AddonOn('add', (addon) =>
        {
            if(addon.GetName() === name)
            {
                loaded = true;
                clearTimeout(timeout);

                if(instant)
                {
                    return callback(addon);
                }

                return setTimeout(() => callback(addon));
            }
        })
    }
};

export default DivhuntAddons;
