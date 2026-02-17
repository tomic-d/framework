import divhunt from '#divhunt';
import actions from '../addon.js';

actions.Fn('run', function(id, props = {})
{
    this.resolve = null;
    this.item = null;
    this.vars = divhunt.AddonGet('variables');
    this.commands = divhunt.AddonGet('commands');

    this.methods.init = async (resolve) =>
    {
        this.resolve = resolve;
        this.item = this.ItemGet(id);

        if(!this.item)
        {
            return this.methods.done(null, `Action "${id}" not found.`, 404);
        }

        props = this.methods.validate(props, 'in');

        if(props === false)
        {
            return;
        }

        const callback = this.item.Get('callback');
        const command = this.item.Get('command');

        if(callback)
        {
            await this.methods.callback(callback, props);
        }
        else if(command)
        {
            await this.methods.command(command, props);
        }
        else
        {
            await this.methods.http(props);
        }
    };

    this.methods.validate = (data, type) =>
    {
        const schema = this.item.Get(type);

        if(!schema)
        {
            return data;
        }

        try
        {
            return divhunt.DataDefine(data, schema);
        }
        catch(error)
        {
            this.methods.done(null, error.message, type === 'in' ? 400 : 500);
            return false;
        }
    };

    this.methods.callback = async (fn, props) =>
    {
        try
        {
            const data = await fn(props);
            return this.methods.done(data, 'Action executed.', 200);
        }
        catch(error)
        {
            return this.methods.done(null, error.message, 500);
        }
    };

    this.methods.command = async (command, props) =>
    {
        if(!this.commands)
        {
            return this.methods.done(null, 'Commands addon not available.', 500);
        }

        const commandId = typeof command === 'string' ? command : command.id;
        const merged = typeof command === 'object' ? { ...command, ...props, id: undefined } : props;

        const item = this.commands.ItemGet(commandId);

        if(!item)
        {
            return this.methods.done(null, `Command "${commandId}" not found.`, 404);
        }

        try
        {
            const result = await item.Fn('run', merged);
            return this.methods.done(result.data, result.message, result.code);
        }
        catch(error)
        {
            return this.methods.done(null, error.message, 500);
        }
    };

    this.methods.http = async (props) =>
    {
        const endpoint = this.item.Get('endpoint');

        if(!endpoint)
        {
            return this.methods.done(null, `Action "${id}" has no callback, command, or endpoint.`, 400);
        }

        try
        {
            const url = this.methods.url(endpoint);
            const opts = this.methods.options(props);
            const res = await fetch(url, opts);

            if(!res.ok)
            {
                return this.methods.done(null, `HTTP ${res.status}: ${res.statusText}`, res.status);
            }

            const data = await res.json();
            return this.methods.done(data, 'Action executed.', 200);
        }
        catch(error)
        {
            return this.methods.done(null, error.message, 500);
        }
    };

    this.methods.url = (endpoint) =>
    {
        return this.methods.process(endpoint);
    };

    this.methods.options = (props) =>
    {
        const method = this.item.Get('method') || 'POST';
        const opts = { method };

        opts.headers = this.methods.headers();
        opts.body = this.methods.body(props);
        opts.headers['Content-Type'] = opts.headers['Content-Type'] || 'application/json';

        return opts;
    };

    this.methods.headers = () =>
    {
        const headers = this.item.Get('headers');
        const result = {};

        if(headers)
        {
            for(const key in headers)
            {
                result[key] = this.methods.process(headers[key]);
            }
        }

        return result;
    };

    this.methods.body = (props) =>
    {
        let body = this.item.Get('body') || props;

        if(typeof body === 'string')
        {
            body = this.methods.process(body);
        }
        else if(typeof body === 'object')
        {
            body = { ...body, ...props };

            for(const key in body)
            {
                if(typeof body[key] === 'string')
                {
                    body[key] = this.methods.process(body[key]);
                }
            }
        }

        return JSON.stringify(body);
    };

    this.methods.process = (value) =>
    {
        if(this.vars && typeof value === 'string')
        {
            return this.vars.Fn('process', value);
        }

        return value;
    };

    this.methods.done = (data, message, code) =>
    {
        if(code >= 200 && code < 300)
        {
            const validated = this.methods.validate(data, 'out');

            if(validated === false)
            {
                return;
            }

            data = validated;
        }

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
