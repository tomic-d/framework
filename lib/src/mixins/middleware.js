const OneTypeMiddleware =
{
    async Middleware(name, value)
    {
        let index = -1;

        const context = {
            value: value,
            errors: [],
            next: async () =>
            {
                index++;

                if (index < (this.middlewares.callbacks[name] || []).length)
                {
                    try
                    {
                        await this.middlewares.callbacks[name][index](context);
                    }
                    catch(error)
                    {
                        this.Error(500, 'Error in middleware callback :name: (:reason:).', {name, reason: error.message});
                        context.errors.push(error);
                    }
                }

                return context;
            }
        };

        if (!this.middlewares.callbacks[name])
        {
            this.middlewares.callbacks[name] = [];
        }

        return await context.next();
    },

    MiddlewareIntercept(name, callback)
    {
        if(!this.middlewares.callbacks[name])
        {
            this.middlewares.callbacks[name] = [];
        }

        this.middlewares.callbacks[name].push(callback);
        return this;
    },

    MiddlewareRegister(name, options = {})
    {
        this.middlewares.data[name] = {
            name,
            description: options.description || '',
            config: options.config || {}
        };

        return this;
    },

    MiddlewareUnregister(name)
    {
        delete this.middlewares.data[name];
        delete this.middlewares.callbacks[name];
        return this;
    },

    MiddlewareGet(name)
    {
        return this.middlewares.data[name] || null;
    },

    Middlewares()
    {
        return this.middlewares.data;
    }
};

export default OneTypeMiddleware;
