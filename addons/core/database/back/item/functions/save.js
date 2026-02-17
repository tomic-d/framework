import database from '#database/addon.js';

database.Fn('item.save', async function(item, connection = null)
{
    const itemId = item.Get('id');
    
    if(itemId)
    {
        return database.Fn('item.update', item, connection);
    }
    else
    {
        return database.Fn('item.create', item, item.addon, connection);
    }
});