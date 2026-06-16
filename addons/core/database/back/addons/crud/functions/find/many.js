import database from '#database/addon.js';

database.Fn('find.many', async function(query, set = false)
{
	const records = await database.Fn('find.execute', query);
	return records.map(data => query.addon.ItemAdd(data, null, set, set));
});
