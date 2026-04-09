import database from '#database/addon.js';

database.Fn('item.save', async function(item, {connection = 'primary', translations = null} = {})
{
    if(item.Get('id'))
    {
        return database.Fn('item.update', item, {connection, translations});
    }
    else
    {
        return database.Fn('item.create', item, {connection, translations});
    }
});