pages.Fn('change', function(target, parameters = {}, options = {})
{
    this.resolve = null;
    this.page = null;
    this.id = null;
    this.parameters = parameters;
    this.options = options;

    this.methods.init = async (resolve) =>
    {
        this.resolve = resolve;

        if(this.options.path)
        {
            this.methods.match();
        }
        else
        {
            this.page = this.ItemGet(target);
            this.id = target;
        }

        if(!this.page)
        {
            // Try to find a 404 page
            const notFoundPage = Object.values(this.Items()).find(p => p.Get('404'));

            if(notFoundPage)
            {
                this.page = notFoundPage;
                this.id = notFoundPage.Get('id');
            }
            else
            {
                return this.methods.done(null, `Page "${target}" not found.`, 404);
            }
        }

        const route = this.page.Get('route');
        const url = this.methods.url(this.methods.route(route, this.parameters), this.parameters);

        if(this.options.push !== false)
        {
            history.pushState(null, '', url);
        }

        const result = this.Fn('open', this.id, this.parameters);

        if(result === false)
        {
            return this.methods.done(null, 'Navigation prevented.', 403);
        }

        return this.methods.done({ id: this.id, parameters: this.parameters, url }, 'Page changed.', 200);
    };

    this.methods.match = () =>
    {
        const result = this.Fn('match', target);

        if(result)
        {
            this.page = result.page;
            this.id = result.page.Get('id');
            this.parameters = { ...result.parameters, ...this.parameters };
        }
    };

    this.methods.route = (route, parameters) =>
    {
        if(!Array.isArray(route))
        {
            return route;
        }

        const keys = Object.keys(parameters);

        for(let i = route.length - 1; i >= 0; i--)
        {
            const params = (route[i].match(/:(\w+)/g) || []).map(p => p.slice(1));

            if(params.length && params.every(p => keys.includes(p)))
            {
                return route[i];
            }
        }

        return route[0];
    };

    this.methods.url = (route, parameters) =>
    {
        let url = route;

        for(const key in parameters)
        {
            url = url.replace(`:${key}`, parameters[key]);
        }

        return url;
    };

    this.methods.done = (data, message, code) =>
    {
        this.resolve({ data, message, code });
    };

    return new Promise((resolve) =>
    {
        try
        {
            this.methods.init(resolve);
        }
        catch(error)
        {
            resolve({ data: null, message: error.message, code: 500 });
        }
    });
});
