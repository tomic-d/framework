import divhunt from '#framework/load.js';
import database from '#database/addon.js';

divhunt.MiddlewareIntercept('addon.items.find', (middleware) =>
{
    let { addon, table, connection } = middleware.value;

    if(!table.name)
    {
        throw new Error('Addon must have table name set.');
    }

    if(typeof connection === 'string')
    {
        connection = database.ItemGet(connection)?.Get('connection');
    }

    if(!connection)
    {
        throw new Error('Database connection is not present.');
    }

    middleware.value.response = database.Fn('find', connection, table, addon);
});