import bugs from '../addon.js';

bugs.Fn('resolve', function(id)
{
    const item = this.ItemGet(id);

    if(item)
    {
        item.Set('resolved', true);
    }

    return item;
});
