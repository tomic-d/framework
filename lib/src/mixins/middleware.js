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

                if (index < this.middleware[name].length)
                {
                    try
                    {
                        await this.middleware[name][index](context);
                    }
                    catch(error)
                    {
                        this.Error(500, 'Error in middleware callback :name:.', {name});
                    }
                }

                return context;
            }
        };

        if (!this.middleware[name])
        {
            this.middleware[name] = [];
        }

        return await context.next();
    },

    MiddlewareIntercept(name, callback)
    {
        if(!this.middleware[name])
        {
            this.middleware[name] = [];
        }

        this.middleware[name].push(callback);
        return this;
    }
};

export default OneTypeMiddleware;
