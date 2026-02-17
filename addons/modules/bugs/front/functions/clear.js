import bugs from '../addon.js';

bugs.Fn('clear', function(source = null)
{
    const items = Object.values(this.Items());

    for(const item of items)
    {
        if(source === null || item.Get('source') === source)
        {
            this.ItemRemove(item.Get('id'));
        }
    }
});
