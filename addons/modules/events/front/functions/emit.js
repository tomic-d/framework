import events from '../addon.js';

events.Fn('emit', async function(id, data = {})
{
    const item = this.ItemGet(id);

    if(!item)
    {
        return [];
    }

    const callbacks = item.Get('callbacks');
    const results = [];
    const remove = [];

    const event = {
        id,
        data,
        stopped: false,
        stop: function() { this.stopped = true; }
    };

    for(let i = 0; i < callbacks.length; i++)
    {
        if(event.stopped)
        {
            break;
        }

        const entry = callbacks[i];

        if(entry.condition && !entry.condition(data, event))
        {
            continue;
        }

        try
        {
            const result = await entry.callback(data, event);
            results.push(result);
        }
        catch(error)
        {
            results.push({ error: error.message });
        }

        if(entry.once)
        {
            remove.push(entry.id);
        }
    }

    if(remove.length > 0)
    {
        const cbs = item.Get('callbacks').filter(cb => !remove.includes(cb.id));
        item.Set('callbacks', cbs);
    }

    return results;
});
