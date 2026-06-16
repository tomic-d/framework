import database from '#database/addon.js';

/* Await a connection's schema readiness (resolves immediately if already synced). */

database.Fn('ready', async function(connection = 'primary')
{
	const item = database.ItemGet(connection);

	if(item)
	{
		await item.StoreGet('ready');
	}
});
