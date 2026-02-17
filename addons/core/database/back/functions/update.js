import database from '#database/addon.js';

database.Fn('update', async function(connection, table, item)
{
    return database.Fn('item.update', item, connection);
});