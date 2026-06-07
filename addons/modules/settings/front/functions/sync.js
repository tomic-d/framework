import settings from '../addon.js';

settings.Fn('sync', function()
{
    const data = {};

    Object.values(this.Items()).forEach((item) =>
    {
        const value = item.Get('value');

        data[item.Get('id')] = value === null || value === undefined ? item.Get('default') : value;
    });

    onetype.StateSet('settings', data);

    return this;
});
