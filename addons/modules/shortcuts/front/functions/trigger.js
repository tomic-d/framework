import divhunt from '#divhunt';
import shortcuts from '../addon.js';

shortcuts.Fn('trigger', function(id, props = {})
{
    this.resolve = null;
    this.item = null;
    this.events = divhunt.AddonGet('events');
    this.commands = divhunt.AddonGet('commands');
    this.actions = divhunt.AddonGet('actions');

    this.methods.init = async (resolve) =>
    {
        this.resolve = resolve;
        this.item = this.ItemGet(id);

        if(!this.item)
        {
            return this.methods.done(null, `Shortcut "${id}" not found.`, 404);
        }

        if(!this.item.Get('enabled'))
        {
            return this.methods.done(null, `Shortcut "${id}" is disabled.`, 403);
        }

        this.methods.emit();

        const callback = this.item.Get('callback');
        const command = this.item.Get('command');
        const action = this.item.Get('action');

        if(callback)
        {
            await this.methods.callback(callback, props);
        }
        else if(command)
        {
            await this.methods.command(command, props);
        }
        else if(action)
        {
            await this.methods.action(action, props);
        }
        else
        {
            return this.methods.done(null, `Shortcut "${id}" has no callback, command, or action.`, 400);
        }
    };

    this.methods.emit = () =>
    {
        if(this.events)
        {
            this.events.Fn('emit', 'shortcut.triggered', {
                id,
                key: this.item.Get('key')
            });
        }
    };

    this.methods.callback = async (fn, props) =>
    {
        try
        {
            const data = await fn(props);
            return this.methods.done(data, 'Shortcut executed.', 200);
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

    this.methods.action = async (action, props) =>
    {
        if(!this.actions)
        {
            return this.methods.done(null, 'Actions addon not available.', 500);
        }

        const actionId = typeof action === 'string' ? action : action.id;
        const merged = typeof action === 'object' ? { ...action, ...props, id: undefined } : props;

        try
        {
            const result = await this.actions.Fn('run', actionId, merged);
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
