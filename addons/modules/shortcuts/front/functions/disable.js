import shortcuts from '../addon.js';

shortcuts.Fn('disable', function(id)
{
    const item = this.ItemGet(id);

    if(!item)
    {
        return false;
    }

    item.Set('enabled', false);

    return true;
});
