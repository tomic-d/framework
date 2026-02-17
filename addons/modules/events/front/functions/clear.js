import events from '../addon.js';

events.Fn('clear', function()
{
    for(const id in this.items.data)
    {
        this.ItemRemove(id);
    }
});
