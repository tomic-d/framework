const OneTypeEmitter =
{
    Emit(name, ...args)
    {
        const listeners = this.emitters.callbacks[name];

        if(!listeners || !listeners.length)
        {
            return false;
        }

        for(let i = 0; i < listeners.length; i++)
        {
            const emitter = listeners[i];

            try
            {
                emitter.callback(...args);

                if(emitter.once)
                {
                    listeners.splice(i, 1);
                    i--;
                }
            }
            catch(error)
            {
                this.Error(500, 'Error in emitter callback :name: — :reason:', {
                    name,
                    reason: error.message,
                    stack: error.stack
                });
            }
        }

        return true;
    },

    async EmitAsync(name, ...args)
    {
        const listeners = this.emitters.callbacks[name];

        if(!listeners || !listeners.length)
        {
            return false;
        }

        for(let i = 0; i < listeners.length; i++)
        {
            const emitter = listeners[i];

            try
            {
                await emitter.callback(...args);

                if(emitter.once)
                {
                    listeners.splice(i, 1);
                    i--;
                }
            }
            catch(error)
            {
                this.Error(500, 'Error in emitter callback :name: — :reason:', {
                    name,
                    reason: error.message,
                    stack: error.stack
                });
            }
        }

        return true;
    },

    EmitOn(name, callback)
    {
        if(!this.emitters.callbacks[name])
        {
            this.emitters.callbacks[name] = [];
        }

        const id = this.GenerateUID();

        this.emitters.callbacks[name].push({id, once: false, callback});

        return id;
    },

    EmitOnce(name, callback)
    {
        if(!this.emitters.callbacks[name])
        {
            this.emitters.callbacks[name] = [];
        }

        const id = this.GenerateUID();

        this.emitters.callbacks[name].push({id, once: true, callback});

        return id;
    },

    EmitOff(name, id)
    {
        if(!(name in this.emitters.callbacks))
        {
            return;
        }

        this.emitters.callbacks[name] = this.emitters.callbacks[name].filter(emitter => emitter.id !== id);
    },

    EmitRegister(name, options = {})
    {
        this.emitters.data[name] = {
            name,
            description: options.description || '',
            config: options.config || {}
        };

        return this;
    },

    EmitUnregister(name)
    {
        delete this.emitters.data[name];
        return this;
    },

    EmitGet(name)
    {
        return this.emitters.data[name] || null;
    },

    Emitters()
    {
        return this.emitters.data;
    }
};

export default OneTypeEmitter;
