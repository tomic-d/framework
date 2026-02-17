import divhunt from '#framework/load.js';
import database from '#database/addon.js';

divhunt.MiddlewareIntercept('item.crud.update', async (middleware) =>
{
    let { item, table, connection } = middleware.value;

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

    middleware.value.response = database.Fn('update', connection, table, item);
});