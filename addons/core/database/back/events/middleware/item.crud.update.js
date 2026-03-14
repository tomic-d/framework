import onetype from '#framework/load.js';
import database from '#database/addon.js';

onetype.MiddlewareIntercept('item.crud.update', async (middleware) =>
{
    let { item, table, connection } = middleware.value;

    if(!table.name)
    {
        throw onetype.Error(400, 'Addon must have table name set.');
    }

    if(typeof connection === 'string')
    {
        connection = database.ItemGet(connection)?.Get('connection');
    }

    if(!connection)
    {
        throw onetype.Error(500, 'Database connection is not present.');
    }

    middleware.value.response = database.Fn('update', connection, table, item);
});