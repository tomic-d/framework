const OneTypeEmitter =
{
    Emit(name, ...args)
    {
        const listeners = this.emitters[name];

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
                this.Error(500, 'Error in emitter callback.', {name});
            }
        }

        return true;
    },

    EmitOn(name, callback)
    {
        if(!this.emitters[name])
        {
            this.emitters[name] = [];
        }

        const id = this.GenerateUID();

        this.emitters[name].push({id, once: false, callback});

        return id;
    },

    EmitOnce(name, callback)
    {
        if(!this.emitters[name])
        {
            this.emitters[name] = [];
        }

        const id = this.GenerateUID();

        this.emitters[name].push({id, once: true, callback});

        return id;
    },

    EmitOff(name, id)
    {
        if(!(name in this.emitters))
        {
            return;
        }

        this.emitters[name] = this.emitters[name].filter(emitter => emitter.id !== id);
    }
};

export default OneTypeEmitter;
