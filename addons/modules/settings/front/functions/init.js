import settings from '../addon.js';

settings.Fn('init', function()
{
    const raw = localStorage.getItem('onetype.settings');

    if(!raw)
    {
        return;
    }

    let data;

    try
    {
        data = JSON.parse(raw);
    }
    catch(error)
    {
        return;
    }

    Object.entries(data).forEach(([id, value]) =>
    {
        let item = this.ItemGet(id);

        if(!item)
        {
            item = this.Item({ id, persist: true });
        }

        item.Set('value', value);

        onetype.Emit('settings.change', { id, value });
    });
});
