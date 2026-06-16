import database from '#database/addon.js';

database.Fn('find.exists', async function(query)
{
	query.limit = 1;
	const count = await database.Fn('find.count', query);
	return count > 0;
});
