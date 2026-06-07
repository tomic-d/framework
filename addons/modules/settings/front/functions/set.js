import settings from '../addon.js';

settings.Fn('set', function(id, value)
{
    let item = this.ItemGet(id);

    if(!item)
    {
        item = this.Item({ id });
    }

    item.Set('value', value);

    if(item.Get('persist'))
    {
        this.Fn('persist');
    }

    onetype.Emit('settings.change', { id, value });

    return item;
});
