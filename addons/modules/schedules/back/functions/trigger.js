import divhunt from '#divhunt';
import schedules from '../addon.js';

schedules.Fn('trigger', function(id, props = {})
{
    this.resolve = null;
    this.item = null;
    this.events = divhunt.AddonGet('events');
    this.commands = divhunt.AddonGet('commands');

    this.methods.init = async (resolve) =>
    {
        this.resolve = resolve;
        this.item = this.ItemGet(id);

        if(!this.item)
        {
            return this.methods.done(null, `Schedule "${id}" not found.`, 404);
        }

        if(!this.item.Get('enabled'))
        {
            return this.methods.done(null, `Schedule "${id}" is disabled.`, 403);
        }

        this.methods.emit();
        this.methods.track();

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
            return this.methods.done(null, `Schedule "${id}" has no callback or command.`, 400);
        }
    };

    this.methods.emit = () =>
    {
        if(this.events)
        {
            this.events.Fn('emit', 'schedule.triggered', {
                id,
                type: this.item.Get('type'),
                runs: this.item.Get('runs')
            });
        }
    };

    this.methods.track = () =>
    {
        const runs = this.item.Get('runs') || 0;
        const repeat = this.item.Get('repeat');
        const type = this.item.Get('type');

        this.item.Set('runs', runs + 1);
        this.item.Set('last', new Date().toISOString());

        if(type === 'once')
        {
            this.Fn('disable', id);
        }
        else if(repeat !== null && runs + 1 >= repeat)
        {
            this.Fn('disable', id);
        }
    };

    this.methods.callback = async (fn, props) =>
    {
        try
        {
            const data = await fn(props);
            return this.methods.done(data, 'Schedule executed.', 200);
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
