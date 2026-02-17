import bugs from '../../addon.js';

bugs.ItemOn('add', function(item)
{
    if(!item.Get('time'))
    {
        item.Set('time', new Date());
    }
});
