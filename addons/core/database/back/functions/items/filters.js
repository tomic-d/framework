import database from '#database/addon.js';

database.Fn('items.filters', function(knexQuery, filters = [])
{
	const builder = database.Fn('items.builder');
	builder.applyFilters(knexQuery, filters);
});
