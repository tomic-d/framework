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

    EventCleanup()
    {
        /* Global emitters */
        for(const emitter of this.Emitters)
        {
            onetype.EmitOff(emitter.name, emitter.id);
        }

        this.Emitters = [];

        /* Visibility / Resize observers */
        if(this.Element)
        {
            onetype.ObserverUnvisible(this.Element);
            onetype.ObserverUnresize(this.Element);
        }

        /* Update frame */
        if(this.UpdateFrame)
        {
            cancelAnimationFrame(this.UpdateFrame);
            this.UpdateFrame = null;
        }

        /* Local events */
        for(const event in this.Events)
        {
            this.Events[event] = [];
        }
    }
};

export default RenderEvents;
