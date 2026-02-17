import database from '#database/addon.js';

database.Fn('create', async function(connection, table, item)
{
    return database.Fn('item.create', item, item.addon, connection);
});