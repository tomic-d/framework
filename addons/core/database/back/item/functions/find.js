import database from '#database/addon.js';

database.Fn('item.find', function(item, connection = null)
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

    return database.Fn('find', connection, table, addon);
});