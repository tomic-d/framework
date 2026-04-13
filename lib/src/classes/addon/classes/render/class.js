import RenderGet from './mixins/get.js';
import RenderSet from './mixins/set.js';
import RenderCompile from './mixins/compile.js';
import RenderDOM from './mixins/dom.js';
import RenderProcess from './mixins/process.js';
import RenderMethods from './mixins/methods.js';
import RenderEvents from './mixins/events.js';

class OneTypeAddonRender
{
    constructor(addon, name, callback)
    {
        this.Addon = addon;
        this.Name = name;
        this.Callback = callback;

        this.UpdateFrame = null;
        this.Data = { state: addon.onetype.StateGet() };
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

        this.Emitters = [];

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
                        if(!target.UpdateFrame)
                        {
                            target.UpdateFrame = requestAnimationFrame(() =>
                            {
                                target.UpdateFrame = null;
                                target.Update();
                            });
                        }
                    }
                }

                return true;
            }
        });

        return proxy;
    }

}

Object.assign(OneTypeAddonRender.prototype, RenderGet);
Object.assign(OneTypeAddonRender.prototype, RenderSet);
Object.assign(OneTypeAddonRender.prototype, RenderCompile);
Object.assign(OneTypeAddonRender.prototype, RenderDOM);
Object.assign(OneTypeAddonRender.prototype, RenderProcess);
Object.assign(OneTypeAddonRender.prototype, RenderMethods);
Object.assign(OneTypeAddonRender.prototype, RenderEvents);

export default OneTypeAddonRender;