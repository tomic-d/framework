import database from '#database/addon.js';

database.Fn('item.transaction', function(item, callback)
{
    item.Get('connection').transaction(async (trx) => 
    {
        try 
        {
            await callback(trx);
            trx.commit();
        }
        catch(error)
        {
            trx.rollback();
        }
    });
});