// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

const DivhuntMiddleware =
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
                        return await this.middleware[name][index](context);
                    }
                    catch(error)
                    {
                        this.LogError('Error in middleware callback: ' + name, {}, error);
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

export default DivhuntMiddleware;
