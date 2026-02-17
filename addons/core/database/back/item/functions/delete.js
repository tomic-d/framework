import database from '#database/addon.js';

database.Fn('item.delete', async function(item, connection = null)
{
    if(!connection)
    {
        connection = item.Get('connection');
    }

    const addon = item.addon;
    const table = addon.Table();

    if(!table.name)
    {
        throw new Error('Addon must have table name set.');
    }

    const key = table.prefix ? table.prefix + 'id' : 'id';

    return connection(table.name).where(key, item.Get('id')).del().then(() =>
    {
        item.Set('id', null);
        return item;
    });
});
