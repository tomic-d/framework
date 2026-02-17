import schedules from '../addon.js';

schedules.Fn('start', function(id)
{
    this.methods.single = (id) =>
    {
        const item = this.ItemGet(id);

        if(!item || !item.Get('enabled'))
        {
            return false;
        }

        if(item.Get('timer'))
        {
            return false;
        }

        const type = item.Get('type');

        if(type === 'once')
        {
            this.methods.once(item);
        }
        else if(type === 'interval')
        {
            this.methods.interval(item);
        }
        else if(type === 'cron')
        {
            this.methods.cron(item);
        }

        return true;
    };

    this.methods.once = (item) =>
    {
        const time = item.Get('time');
        const target = typeof time === 'string' ? new Date(time).getTime() : time;
        const delay = target - Date.now();

        if(delay <= 0)
        {
            this.Fn('trigger', item.Get('id'));
            return;
        }

        const next = new Date(target).toISOString();
        item.Set('next', next);

        const timer = setTimeout(() =>
        {
            this.Fn('trigger', item.Get('id'));
            item.Set('timer', null);
            item.Set('next', null);
        }, delay);

        item.Set('timer', timer);
    };

    this.methods.interval = (item) =>
    {
        const time = item.Get('time');
        const ms = typeof time === 'string' ? parseInt(time, 10) : time;

        const next = new Date(Date.now() + ms).toISOString();
        item.Set('next', next);

        const timer = setInterval(() =>
        {
            if(!item.Get('enabled'))
            {
                clearInterval(item.Get('timer'));
                item.Set('timer', null);
                item.Set('next', null);
                return;
            }

            this.Fn('trigger', item.Get('id'));

            const nextRun = new Date(Date.now() + ms).toISOString();
            item.Set('next', nextRun);
        }, ms);

        item.Set('timer', timer);
    };

    this.methods.cron = (item) =>
    {
        const next = this.Fn('next', item.Get('id'));

        if(!next)
        {
            return;
        }

        const delay = next - Date.now();
        item.Set('next', new Date(next).toISOString());

        const timer = setTimeout(() =>
        {
            this.Fn('trigger', item.Get('id'));
            item.Set('timer', null);

            if(item.Get('enabled'))
            {
                this.methods.cron(item);
            }
        }, delay);

        item.Set('timer', timer);
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
