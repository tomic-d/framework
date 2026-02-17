// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

import DivhuntAddonItem from '../classes/item/class.js';

const AddonItems =
{
    Item(identifierOrObject, map = null, then = null, callback = true)
    {
        if(identifierOrObject && typeof identifierOrObject === 'object')
        {
            return this.ItemAdd(identifierOrObject, then, callback);
        }
        else
        {
            return this.ItemGet(identifierOrObject, map, then);
        }
    },

    Items()
    {
        return this.items.data;
    },

    ItemGet(identifier, map = null, then = null)
    {
        if(map)
        {
            if(!(map in this.items.map) || !(identifier in this.items.map[map])) 
            {
                return null;
            }

            return this.ItemGet(this.items.map[map][identifier], null, then);
        }
        
        if(!(identifier in this.items.data))
        {
            return null;
        }

        then && then(this.items.data[identifier]);

        return this.items.data[identifier];
    },

    ItemGetByMap(identifier, then = null)
    {
        if(!(identifier in this.items.data))
        {
            return null;
        }

        then && then(this.items.data[identifier]);

        return this.items.data[identifier];
    },

    ItemAdd(object, then = null, callback = true, set = true)
    {
        if(!this.FieldGet('id'))
        {
            this.FieldAdd('id', ['number']);
        }

        let item = new DivhuntAddonItem(this, {});

        if(!('id' in object))
        {
            object.id = this.items.id++;
        }

        item.SetData(object, false);

        if(callback)
        {
            this.items.callbacks.add.forEach(callback => callback.call(this, item));
            this.divhunt.Emit('addon.item.add', this, item);
        }

        then && then(item);

        if(set)
        {
            this.items.data[item.Get('id') || this.items.id++] = item;
        }

        if(callback)
        {
            this.items.callbacks.added.forEach(callback => callback.call(this, item));
            this.divhunt.Emit('addon.item.added', this, item);
        }

        return item;
    },

    ItemsAdd(items, then = null, callback = true)
    {
        const added = [];

        for (const item of items)
        {
            added.push(this.ItemAdd(item, null, callback));
        }

        then && then(added);

        return added;
    },

    ItemRemove(id, callback = true)
    {
        const item = this.ItemGet(id);

        if(!item)
        {
            return;
        }

        Object.values(this.fields.data).forEach((field) =>
        {
            if(field.map)
            {
                delete this.items.map[field.name][item.Get(field.name)]
            }
        })

        if(callback)
        {
            this.items.callbacks.remove.forEach(callback => callback.call(this, item));
            this.divhunt.Emit('addon.item.remove', this, item);
        }

        delete this.items.data[id];

        if(callback)
        {
            this.items.callbacks.removed.forEach(callback => callback.call(this, item));
            this.divhunt.Emit('addon.item.removed', this, item);
        }
    },


    ItemsRemove(callback = true)
    {
        if(!callback)
        {
            this.items.data = {};
        }
        else
        {
            for(let id in this.items.data)
            {
                this.ItemRemove(id, callback);
            }
        }
    },

    ItemOn(type, callback, id = null)
    {
        if(!(type in this.items.callbacks))
        {
            this.LogWarn('Item catcher not found for: ' + type + '.');
            return this;
        }

        if(id)
        {
            this.items.callbacks[type] = this.items.callbacks[type].filter(cb => cb._id !== id);
            callback._id = id;
        }

        this.items.callbacks[type].push(callback);
    }
};

export default AddonItems;
