import divhunt from '#divhunt';
import shortcuts from '../addon.js';

shortcuts.Fn('register', function()
{
    if(this.StoreGet('registered'))
    {
        return;
    }

    this.StoreSet('registered', true);
    this.StoreSet('context', null);

    this.vars = divhunt.AddonGet('variables');

    this.methods.handler = (e) =>
    {
        const key = this.methods.parse(e);
        const items = this.methods.match(key);

        for(const item of items)
        {
            if(this.methods.check(item, e))
            {
                if(item.Get('prevent'))
                {
                    e.preventDefault();
                }

                if(item.Get('stop'))
                {
                    e.stopPropagation();
                }

                this.Fn('trigger', item.Get('id'));
            }
        }
    };

    this.methods.parse = (e) =>
    {
        const parts = [];

        if(e.ctrlKey) parts.push('ctrl');
        if(e.altKey) parts.push('alt');
        if(e.shiftKey) parts.push('shift');
        if(e.metaKey) parts.push('meta');

        const name = e.key.toLowerCase();

        if(!['control', 'alt', 'shift', 'meta'].includes(name))
        {
            parts.push(name);
        }

        return parts.join('+');
    };

    this.methods.match = (key) =>
    {
        const items = [];

        for(const id in this.items.data)
        {
            const item = this.items.data[id];
            const itemKey = item.Get('key');

            if(itemKey && itemKey.toLowerCase() === key)
            {
                items.push(item);
            }
        }

        items.sort((a, b) => b.Get('priority') - a.Get('priority'));

        return items;
    };

    this.methods.check = (item, e) =>
    {
        if(!item.Get('enabled'))
        {
            return false;
        }

        if(!this.methods.context(item))
        {
            return false;
        }

        if(!this.methods.target(item))
        {
            return false;
        }

        if(!this.methods.condition(item, e))
        {
            return false;
        }

        return true;
    };

    this.methods.context = (item) =>
    {
        const context = item.Get('context');
        const current = this.StoreGet('context');

        if(context && context !== current)
        {
            return false;
        }

        return true;
    };

    this.methods.target = (item) =>
    {
        const target = item.Get('target');

        if(!target)
        {
            return true;
        }

        const element = document.querySelector(target);

        if(!element || !element.contains(document.activeElement))
        {
            return false;
        }

        return true;
    };

    this.methods.condition = (item, e) =>
    {
        const condition = item.Get('condition');

        if(!condition)
        {
            return true;
        }

        if(typeof condition === 'function')
        {
            return condition(e);
        }

        if(typeof condition === 'string' && this.vars)
        {
            const processed = this.vars.Fn('process', condition);

            try
            {
                return divhunt.Function(`return ${processed}`)();
            }
            catch
            {
                return false;
            }
        }

        return true;
    };

    document.addEventListener('keydown', this.methods.handler);

    this.StoreSet('handler', this.methods.handler);
});
