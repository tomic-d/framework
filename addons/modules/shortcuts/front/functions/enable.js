import shortcuts from '../addon.js';

shortcuts.Fn('enable', function(id)
{
    const item = this.ItemGet(id);

    if(!item)
    {
        return false;
    }

    item.Set('enabled', true);

    return true;
});
