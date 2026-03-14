import onetype from '#framework/load.js';
import database from '#database/addon.js';

onetype.MiddlewareIntercept('addon.items.find', (middleware) =>
{
    let { addon, table, connection } = middleware.value;

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

    middleware.value.response = database.Fn('find', connection, table, addon);
});