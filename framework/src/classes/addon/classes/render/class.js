// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

import RenderGet from './mixins/get.js';
import RenderSet from './mixins/set.js';
import RenderCompile from './mixins/compile.js';
import RenderDOM from './mixins/dom.js';
import RenderProcess from './mixins/process.js';
import RenderMethods from './mixins/methods.js';
import RenderEvents from './mixins/events.js';

class DivhuntAddonRender
{
    constructor(addon, name, callback)
    {
        this.Addon = addon;
        this.Name = name;
        this.Callback = callback;

        this._updateTimeout = null;
        this.Data = {};
        this.Attributes = {};
        this.Item = null;
        this.Slots = {};

        this.Element = null;
        this.Nodes = {};
        this.Html = '';
        this.Time = 0;

        this.Events = {
            init: [],
            render: [],
            mount: [],
            mounted: [],
            unmount: [],
            unmounted: [],
            destroy: [],
            error: [],
            ready: [],
            visible: [],
            resize: [],
            compile: []
        };

        this.State = {
            ready: false,
            initialized: false,
            rendered: false,
            mounted: false,
            destroyed: false,
            rendering: false
        };

        this.Observer = {
            visibility: undefined,
            resize: undefined
        };

        const proxy = new Proxy(this, {
            get(target, prop)
            {
                if (typeof target[prop] !== 'undefined' || typeof prop === 'symbol')
                {
                    return target[prop];
                }

                return target.Data[prop];
            },

            set(target, prop, value)
            {
                if (prop in target || typeof prop === 'symbol')
                {
                    target[prop] = value;
                }
                else
                {
                    const changed = target.Data[prop] !== value;
                    target.Data[prop] = value;

                    if(changed && target.State.ready && !target.State.rendering)
                    {
                        target._scheduleUpdate();
                    }
                }

                return true;
            }
        });

        return proxy;
    }

    _scheduleUpdate()
    {
        if(this._updateTimeout)
        {
            clearTimeout(this._updateTimeout);
        }

        this._updateTimeout = setTimeout(() =>
        {
            this._updateTimeout = null;
            this.Update();
        }, 16);
    }
}

Object.assign(DivhuntAddonRender.prototype, RenderGet);
Object.assign(DivhuntAddonRender.prototype, RenderSet);
Object.assign(DivhuntAddonRender.prototype, RenderCompile);
Object.assign(DivhuntAddonRender.prototype, RenderDOM);
Object.assign(DivhuntAddonRender.prototype, RenderProcess);
Object.assign(DivhuntAddonRender.prototype, RenderMethods);
Object.assign(DivhuntAddonRender.prototype, RenderEvents);

export default DivhuntAddonRender;