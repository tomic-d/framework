import schedules from '../addon.js';

schedules.Fn('disable', function(id)
{
    const item = this.ItemGet(id);

    if(!item)
    {
        return false;
    }

    item.Set('enabled', false);

    this.Fn('stop', id);

    return true;
});
