import database from '#database/addon.js';

database.Fn('items.methods.exists', async function(query)
{
	query.limit = 1;
	const count = await database.Fn('items.methods.count', query);
	return count > 0;
});
