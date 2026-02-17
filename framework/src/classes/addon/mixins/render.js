// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

import DivhuntAddonRender from '../classes/render/class.js';

const AddonRender =
{
    Render(name, data = {}, attributes = {}, slots = {}, item = null)
    {
        if(typeof data === 'function')
        {
            return this.RenderAdd(name, data);
        }
        else
        {
            return this.RenderRun(name, data, attributes, slots, item);
        }
    },

    RenderAdd(name, callback)
    {
        this.FnAdd('render.' + name, function(data, attributes, slots, item)
        {
            const render = new DivhuntAddonRender(this, name, callback);

            render.SetData(data).SetAttributes(attributes).SetSlots(slots).SetItem(item);

            return render.Process();
        });

        return this;
    },

    RenderRun(name, data = {}, attributes = {}, slots = {}, item = null)
    {
        const fn = this.FnGet('render.' + name);

        if(!fn)
        {
            throw new Error('Render ' + name +' doesn\'t exist.');
        }

        return fn.callback.call(this, data, attributes, slots, item);
    },

    RenderRemove(name)
    {
        this.FnRemove('render.' + name);
        return this;
    },
    
    RenderExists(name)
    {
        return !!this.FnGet('render.' + name);
    }
};

export default AddonRender;