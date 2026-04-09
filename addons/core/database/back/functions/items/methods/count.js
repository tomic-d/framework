import database from '#database/addon.js';

database.Fn('items.methods.count', async function(query)
{
	const builder = database.Fn('items.builder');
	const knexQuery = query.knex(query.table.name).count('* as count');

	builder.applyFilters(knexQuery, query.filters);

	const result = await knexQuery;
	return parseInt(result[0]?.count || 0);
});
