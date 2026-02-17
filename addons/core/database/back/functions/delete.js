import database from '#database/addon.js';

database.Fn('delete', async function(connection, table, item)
{
    return database.Fn('item.delete', item, connection);
});