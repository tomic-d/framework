// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

const RenderMethods =
{
    Mount(target)
    {
        try
        {
            if(!this.Element)
            {
                throw new Error('Cannot mount - render not processed');
            }
            
            if(this.State.mounted)
            {
                throw new Error('Already mounted');
            }
            
            /* Before mount */
            this.EventEmit('mount');
            
            /* Insert into DOM */
            target = typeof target === 'string' ? document.querySelector(target) : target;

            if(!target)
            {
                throw new Error('Target element not found');
            }

            target.appendChild(this.Element);
            
            /* After mount */
            this.EventEmit('mounted');
            
            return this;
        }
        catch(error)
        {
            console.log(error);
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
        const data = this.GetDivhunt().DataDefine(this, config);

        for(const key in data)
        {
            this.Data[key] = data[key];
        }
    },

    Update()
    {
        try
        {
            if(!this.Element)
            {
                throw new Error('Cannot update - element not rendered');
            }

            const compiled = this.Compile(this.Html);

            this.GetDivhunt().DOMPatch(this.Element, compiled.element);

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
    
    
    OnBeforeUnmount(callback)
    {
        return this.EventOn('unmount', callback);
    },
    
    OnUnmount(callback)
    {
        return this.EventOn('unmount', callback);
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
        return this.EventOn('visible', callback);
    },
    
    OnResize(callback)
    {
        return this.EventOn('resize', callback);
    },
    
    
    OnError(callback)
    {
        return this.EventOn('error', callback);
    },
    
};

export default RenderMethods;