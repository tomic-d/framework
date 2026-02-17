// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

const RenderEvents =
{
    EventOn(event, callback)
    {
        if(!(event in this.Events))
        {
            throw new Error('Event ' + event + ' doesn\'t exist.');
        }

        const run = {
            init:    () => this.State.initialized,
            mount:   () => this.State.mounted,
            mounted: () => this.State.mounted,
            ready:   () => this.State.ready
        };

        if(run[event] && run[event]())
        {
            callback.call(this);
        }
        else
        {
            this.Events[event].push(callback);
        }
        
        return this;
    },

    EventEmit(event, ...args)
    {
        if(!(event in this.Events))
        {
            throw new Error('Event ' + event + ' doesn\'t exist.');
        }

        const skip = {
            init:      () => this.State.initialized,
            mount:     () => this.State.mounted,
            unmount:   () => !this.State.mounted,
            unmounted: () => !this.State.mounted,
            destroy:   () => this.State.destroyed,
            ready:     () => this.State.ready
        };

        if(skip[event] && skip[event]())
        {
            return this;
        }

        this.Events[event].forEach(callback => callback.call(this, ...args));

        const after = {
            init:      () => { this.State.initialized = true; },
            mount:     () => { this.State.mounted = true; },
            render:    () => { this.State.rendered = true; },
            ready:     () => { this.State.ready = true; },
            destroy:   () => { this.State.destroyed = true; this.EventCleanup(); },
            mounted:   () => { this.EventEmit('ready'); },
            unmounted: () => { this.State.mounted = false; }
        };

        if(after[event])
        {
            after[event]();
        }

        return this;
    },

    EventOff(event, callback)
    {
         if(!(event in this.Events))
        {
            throw new Error('Event ' + event + ' doesn\'t exist.');
        }

        if(!callback)
        {
            this.Events[event] = [];
            return this;
        }

        const index = this.Events[event].indexOf(callback);
        if(index > -1)
        {
            this.Events[event].splice(index, 1);
        }

        return this;
    },

    EventOnce(event, callback)
    {
        const onceWrapper = (...args) =>
        {
            callback.call(this, ...args);
            this.EventOff(event, onceWrapper);
        };

        return this.EventOn(event, onceWrapper);
    },

    EventInitObserver(type)
    {
        if(this.Observer[type])
        {
            return;
        }

        this.EventOn('mount', () =>
        {
            if(type === 'visibility')
            {
                this.Observer[type] = new IntersectionObserver(entries =>
                {
                    entries.forEach(entry =>
                    {
                        if(entry.isIntersecting)
                        {
                            this.EventEmit('visible', entry);
                        }
                    });
                }, {threshold: 0.1});
            }
            else if(type === 'resize')
            {
                this.Observer[type] = new ResizeObserver(entries =>
                {
                    entries.forEach(entry => this.EventEmit('resize', entry));
                });
            }

            this.Observer[type].observe(this.Element);
        });
    },
    
    EventCleanup()
    {
        Object.keys(this.Observer).forEach(key =>
        {
            if(this.Observer[key])
            {
                this.Observer[key].disconnect();
                this.Observer[key] = undefined;
            }
        });
    }
};

export default RenderEvents;