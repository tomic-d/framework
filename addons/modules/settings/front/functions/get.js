import settings from '../addon.js';

settings.Fn('get', function(id, fallback = null)
{
    const item = this.ItemGet(id);

    if(!item)
    {
        return fallback;
    }

    const value = item.Get('value');

    if(value !== null && value !== undefined)
    {
        return value;
    }

    const fallbackDefault = item.Get('default');

    return fallbackDefault === null || fallbackDefault === undefined ? fallback : fallbackDefault;
});
