import schedules from '../addon.js';

schedules.Fn('next', function(id)
{
    this.item = this.ItemGet(id);

    if(!this.item)
    {
        return null;
    }

    this.type = this.item.Get('type');
    this.time = this.item.Get('time');
    this.timezone = this.item.Get('timezone');

    this.methods.once = () =>
    {
        const target = typeof this.time === 'string' ? new Date(this.time).getTime() : this.time;

        if(target <= Date.now())
        {
            return null;
        }

        return target;
    };

    this.methods.interval = () =>
    {
        const ms = typeof this.time === 'string' ? parseInt(this.time, 10) : this.time;
        return Date.now() + ms;
    };

    this.methods.cron = () =>
    {
        const parsed = this.methods.parse(this.time);

        if(!parsed)
        {
            return null;
        }

        return this.methods.calculate(parsed);
    };

    this.methods.parse = (expr) =>
    {
        const parts = expr.trim().split(/\s+/);

        if(parts.length !== 5)
        {
            return null;
        }

        return {
            minute: parts[0],
            hour: parts[1],
            day: parts[2],
            month: parts[3],
            weekday: parts[4]
        };
    };

    this.methods.calculate = (cron) =>
    {
        const now = new Date();

        for(let i = 1; i < 525600; i++)
        {
            const next = new Date(now.getTime() + i * 60000);

            if(this.methods.matches(next, cron))
            {
                return next.getTime();
            }
        }

        return null;
    };

    this.methods.matches = (date, cron) =>
    {
        const minute = date.getMinutes();
        const hour = date.getHours();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const weekday = date.getDay();

        return (
            this.methods.field(cron.minute, minute, 0, 59) &&
            this.methods.field(cron.hour, hour, 0, 23) &&
            this.methods.field(cron.day, day, 1, 31) &&
            this.methods.field(cron.month, month, 1, 12) &&
            this.methods.field(cron.weekday, weekday, 0, 6)
        );
    };

    this.methods.field = (expr, value, min, max) =>
    {
        if(expr === '*')
        {
            return true;
        }

        if(expr.includes(','))
        {
            const values = expr.split(',').map(v => parseInt(v, 10));
            return values.includes(value);
        }

        if(expr.includes('-'))
        {
            const [start, end] = expr.split('-').map(v => parseInt(v, 10));
            return value >= start && value <= end;
        }

        if(expr.includes('/'))
        {
            const [base, step] = expr.split('/');
            const stepNum = parseInt(step, 10);
            const startNum = base === '*' ? min : parseInt(base, 10);
            return (value - startNum) % stepNum === 0 && value >= startNum;
        }

        return parseInt(expr, 10) === value;
    };

    if(this.type === 'once')
    {
        return this.methods.once();
    }
    else if(this.type === 'interval')
    {
        return this.methods.interval();
    }
    else if(this.type === 'cron')
    {
        return this.methods.cron();
    }

    return null;
});
