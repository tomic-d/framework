import settings from '../addon.js';

settings.Fn('persist', function()
{
    const data = {};

    Object.values(this.Items()).forEach((item) =>
    {
        if(item.Get('persist'))
        {
            data[item.Get('id')] = item.Get('value');
        }
    });

    localStorage.setItem('onetype.settings', JSON.stringify(data));

    return data;
});
