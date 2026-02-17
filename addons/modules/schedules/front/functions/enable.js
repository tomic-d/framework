import schedules from '../addon.js';

schedules.Fn('enable', function(id)
{
    const item = this.ItemGet(id);

    if(!item)
    {
        return false;
    }

    item.Set('enabled', true);

    this.Fn('start', id);

    return true;
});
