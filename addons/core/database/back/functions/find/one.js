import database from '#database/addon.js';

database.Fn('find.one', async function(query, set = false)
{
	query.limit = 1;
	const results = await database.Fn('find.many', query, set);
	return results.length > 0 ? results[0] : null;
});
