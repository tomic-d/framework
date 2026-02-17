import divhunt from '#divhunt';
import variables from '../addon.js';

variables.Fn('process', function(string)
{
    if(typeof string !== 'string')
    {
        return string;
    }

    return string.replace(/\$\{([^}]+)\}/g, (match, expr) =>
    {
        const parts = expr.trim().split('.');
        const id = parts[0];
        const key = parts.slice(1).join('.');

        const item = this.ItemGet(id);

        if(!item)
        {
            try
            {
                return divhunt.Function(`return ${expr}`)();
            }
            catch
            {
                return match;
            }
        }

        let value = item.Get('value');

        if(key && typeof value === 'object' && value !== null)
        {
            const keys = key.split('.');

            for(const k of keys)
            {
                if(value && typeof value === 'object' && k in value)
                {
                    value = value[k];
                }
                else
                {
                    return match;
                }
            }
        }

        return value;
    });
});
