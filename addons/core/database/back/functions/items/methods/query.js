import database from '#database/addon.js';

database.Fn('items.methods.query', async function(query)
{
	const builder = database.Fn('items.builder');
	const knexQuery = query.knex(query.table.name);

	builder.applySelect(knexQuery, query.select, query.distinct);
	builder.applyFilters(knexQuery, query.filters);
	builder.applySearch(knexQuery, query.search, query.addon, query.select);
	builder.applySort(knexQuery, query.sort);
	builder.applyPagination(knexQuery, query.limit, query.page);

	const result = await knexQuery;

	const records = result.map((record) =>
	{
		const data = {};

		Object.entries(record).forEach(([key, value]) =>
		{
			if(value instanceof Date)
			{
				value = value.toISOString();
			}

			data[key] = value;
		});

		return data;
	});

	return database.Fn('items.transform.translate', records, query);
});
