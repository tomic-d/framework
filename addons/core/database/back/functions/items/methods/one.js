import database from '#database/addon.js';

database.Fn('items.methods.one', async function(query, set = false)
{
	query.limit = 1;
	const results = await database.Fn('items.methods.many', query, set);
	return results.length > 0 ? results[0] : null;
});
