// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

const DivhuntEmitter =
{
    Emit(name, ...args)
    {
        name = name.toLowerCase();

        if(!(name in this.emitters))
        {
            return;
        }

        this.emitters[name].forEach(emitter =>
        {
            try
            {
                emitter.callback(...args);

                if (emitter.once)
                {
                    this.EmitOff(name, emitter.id);
                }
            }
            catch(error)
            {
                this.LogError(`Error in emitter callback.`, {name}, error);
            }
        });
    },

    EmitOn(name, callback)
    {
        name = name.toLowerCase();

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
        name = name.toLowerCase();

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
        name = name.toLowerCase();

        if(!(name in this.emitters))
        {
            return;
        }

        this.emitters[name] = this.emitters[name].filter(emitter => emitter.id !== id);
    }
};

export default DivhuntEmitter;
