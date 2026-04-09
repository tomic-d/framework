import database from '#database/addon.js';

database.Fn('items.methods.plain', async function(query)
{
	const builder = database.Fn('items.builder');
	const countQuery = query.knex(query.table.name).count('* as count');

	builder.applyFilters(countQuery, query.filters);

	let [records, countResult] = await Promise.all([
		database.Fn('items.methods.query', query),
		countQuery
	]);

	if(query.joins.length)
	{
		records = await database.Fn('items.transform.join', records, query.joins);
	}

	const total = parseInt(countResult[0]?.count || 0);

	return {
		items: records,
		total,
		page: query.page,
		pages: query.limit > 0 ? Math.ceil(total / query.limit) : 1,
		limit: query.limit
	};
});
