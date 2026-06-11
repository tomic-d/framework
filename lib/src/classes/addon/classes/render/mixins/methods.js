import onetype from '#framework/load.js';

const RenderMethods =
{
    Mount(target)
    {
        try
        {
            if(!this.Element)
            {
                throw onetype.Error(400,'Cannot mount - render not processed');
            }

            if(this.State.mounted)
            {
                throw onetype.Error(400,'Already mounted');
            }

            /* Before mount */
            this.EventEmit('mount');

            /* Insert into DOM */
            target = typeof target === 'string' ? document.querySelector(target) : target;

            if(!target)
            {
                throw onetype.Error(400,'Target element not found');
            }

            target.appendChild(this.Element);

            /* After mount */
            this.State.mounted = true;
            this.EventEmit('mounted');

            return this;
        }
        catch(error)
        {
            this.EventEmit('error', error);
            return this;
        }
    },

    Unmount()
    {
        try
        {
            if(!this.State.mounted)
            {
                return this;
            }

            /* Before unmount */
            this.EventEmit('unmount');

            /* Remove from DOM */
            if(this.Element && this.Element.parentNode)
            {
                this.Element.parentNode.removeChild(this.Element);
            }

            /* After unmount */
            this.State.mounted = false;
            this.EventEmit('unmounted');

            return this;
        }
        catch(error)
        {
            this.EventEmit('error', error);
            return this;
        }
    },

    Destroy()
    {
        try
        {
            /* Unmount first */
            this.Unmount();

            /* Emit destroy */
            this.EventEmit('destroy');

            /* Clear references */
            this.Element = null;
            this.Nodes = {};

            return this;
        }
        catch(error)
        {
            this.EventEmit('error', error);
            return this;
        }
    },

    /* State Management */

    Define(config)
    {
        this.Config = config;

        const data = onetype.DataDefine(this, config);

        for(const key of Object.keys(config))
        {
            this.Data[key] = data[key];
        }
    },

    Compute(callback)
    {
        this.ComputeCallback = callback;
        callback.call(this);
    },

    UpdateData(data)
    {
        let changed = false;

        for(const key in data)
        {
            if(key === 'state')
            {
                continue;
            }

            let value = data[key];

            if(typeof value === 'function')
            {
                this.Data[key] = value;
                continue;
            }

            if(this.Config && this.Config[key])
            {
                value = onetype.DataDefineOne(value, this.Config[key]);
            }

            if(this.Data[key] !== value)
            {
                this.Data[key] = value;
                changed = true;
            }
        }

        if(changed && this.State.ready && !this.State.rendering && !this.UpdateFrame)
        {
            if(this.ComputeCallback)
            {
                this.State.rendering = true;
                this.ComputeCallback.call(this);
                this.State.rendering = false;
            }

            this.UpdateFrame = requestAnimationFrame(() =>
            {
                this.UpdateFrame = null;
                this.Update();
            });
        }
    },

    Update()
    {
        try
        {
            if(!this.Element)
            {
                throw onetype.Error(400,'Cannot update - element not rendered');
            }

            const compiled = this.Compile(this.Html);

            onetype.DOMPatch(this.Element, compiled.element);

            this.Nodes = compiled.nodes;
            this.Time = compiled.time;

            return this;
        }
        catch(error)
        {
            this.EventEmit('error', error);
            return this;
        }
    },

    /* Lifecycle Hooks */

    OnInit(callback)
    {
        return this.EventOn('init', callback);
    },

    OnMount(callback)
    {
        return this.EventOn('mount', callback);
    },

    OnMounted(callback)
    {
        return this.EventOn('mounted', callback);
    },

    OnUnmount(callback)
    {
        return this.EventOn('unmount', callback);
    },

    OnUnmounted(callback)
    {
        return this.EventOn('unmounted', callback);
    },

    OnDestroy(callback)
    {
        return this.EventOn('destroy', callback);
    },

    OnReady(callback)
    {
        return this.EventOn('ready', callback);
    },

    OnVisible(callback)
    {
        const render = this;

        this.EventOn('ready', () =>
        {
            onetype.ObserverVisible(render.Element, (entry) =>
            {
                callback.call(render, entry);
            });
        });
    },

    OnResize(callback)
    {
        const render = this;

        this.EventOn('ready', () =>
        {
            onetype.ObserverResize(render.Element, (entry) =>
            {
                callback.call(render, entry);
            });
        });
    },

    OnError(callback)
    {
        return this.EventOn('error', callback);
    },

    /* Global Emitter */

    Emit(name, ...args)
    {
        onetype.Emit(name, ...args);
    },

    On(name, callback)
    {
        const render = this;

        const id = onetype.EmitOn(name, function(...args)
        {
            callback.call(render, ...args);
        });

        this.Emitters.push({ name, id });
    },
};

export default RenderMethods;
