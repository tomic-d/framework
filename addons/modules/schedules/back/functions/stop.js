import schedules from '../addon.js';

schedules.Fn('stop', function(id)
{
    this.methods.single = (id) =>
    {
        const item = this.ItemGet(id);

        if(!item)
        {
            return false;
        }

        const timer = item.Get('timer');

        if(timer)
        {
            clearTimeout(timer);
            clearInterval(timer);
            item.Set('timer', null);
            item.Set('next', null);
        }

        return true;
    };

    if(id)
    {
        return this.methods.single(id);
    }

    for(const itemId in this.items.data)
    {
        this.methods.single(itemId);
    }

    return true;
});
