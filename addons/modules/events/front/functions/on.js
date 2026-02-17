import events from '../addon.js';

events.Fn('on', function(id, callback, opts = {})
{
    const priority = opts.priority || 0;
    const condition = opts.condition || null;
    const once = opts.once || false;

    let item = this.ItemGet(id);

    if(!item)
    {
        item = this.Item({ id });
    }

    const entry = {
        id: Date.now() + Math.random(),
        callback,
        condition,
        once,
        priority
    };

    const callbacks = item.Get('callbacks');
    callbacks.push(entry);
    callbacks.sort((a, b) => b.priority - a.priority);
    item.Set('callbacks', callbacks);

    return () =>
    {
        const cbs = item.Get('callbacks');
        const index = cbs.findIndex(cb => cb.id === entry.id);

        if(index !== -1)
        {
            cbs.splice(index, 1);
            item.Set('callbacks', cbs);
        }
    };
});
