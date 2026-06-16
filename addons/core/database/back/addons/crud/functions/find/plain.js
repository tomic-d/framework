import database from '#database/addon.js';

database.Fn('find.plain', async function(query)
{
	const [items, total] = await Promise.all([
		database.Fn('find.execute', query),
		database.Fn('find.count', query)
	]);

	return {
		items,
		total,
		page: query.page,
		pages: query.limit > 0 ? Math.ceil(total / query.limit) : 1,
		limit: query.limit
	};
});
