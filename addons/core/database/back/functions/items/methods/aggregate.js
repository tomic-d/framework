import database from '#database/addon.js';

database.Fn('items.methods.aggregate', async function(query, type, field)
{
	const validation = database.Fn('items.validation');
	validation.field(field);

	const builder = database.Fn('items.builder');
	const knexQuery = query.knex(query.table.name)[type](`${field} as result`);

	builder.applyFilters(knexQuery, query.filters);

	const result = await knexQuery;
	return parseFloat(result[0]?.result || 0);
});
