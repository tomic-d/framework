import events from '../addon.js';

events.Fn('off', function(id, callback = null)
{
    const item = this.ItemGet(id);

    if(!item)
    {
        return false;
    }

    if(callback === null)
    {
        item.Set('callbacks', []);
        return true;
    }

    const callbacks = item.Get('callbacks');
    const filtered = callbacks.filter(cb => cb.callback !== callback);
    item.Set('callbacks', filtered);

    return true;
});
