import onetype from '#framework/load.js';
import variables from '#variables/core/addon.js';

variables.Fn('process', function(string)
{
    if(typeof string !== 'string')
    {
        return string;
    }

    const safe = onetype.environment === 'back';
    const data = {};

    for(const id in this.items.data)
    {
        data[id] = this.items.data[id].Get('value');
    }

    if(!string.includes('${'))
    {
        const result = onetype.Function(string, data, safe);

        return result !== undefined ? result : string;
    }

    const single = string.match(/^\$\{([^}]+)\}$/);

    if(single)
    {
        const result = onetype.Function(single[1], data, safe);

        return result !== undefined ? result : string;
    }

    return string.replace(/\$\{([^}]+)\}/g, (match, expression) =>
    {
        const result = onetype.Function(expression, data, safe);

        if(result === undefined || (typeof result === 'object' && result !== null))
        {
            return match;
        }

        return result;
    });
});
