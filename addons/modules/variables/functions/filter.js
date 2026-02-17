import variables from '../addon.js';

variables.Fn('filter', function(group = null)
{
    const result = [];

    for(const id in this.items.data)
    {
        const item = this.items.data[id];

        if(group === null || item.Get('group') === group)
        {
            result.push({
                id: item.Get('id'),
                value: item.Get('value'),
                type: item.Get('type'),
                key: item.Get('key'),
                group: item.Get('group')
            });
        }
    }

    return result;
});
