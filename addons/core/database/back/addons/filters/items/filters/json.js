import filters from '../addon.js';
import database from '#database/addon.js';

/* JSON-array operators. They need the engine's jsonContains, resolved once into
   helpers up front (build runs sync inside the knex callback and cannot await).
   CONTAINS = every value present (AND), OVERLAP = any value present (OR),
   HAS = a single value present. */

const resolve = async (knex, helpers) =>
{
	helpers.jsonContains = await database.Fn('operation', knex, 'jsonContains');
};

filters.Item({
	id: 'CONTAINS',
	resolve,
	validate: (filter, validation) =>
	{
		validation.field(filter.field);

		if(!Array.isArray(filter.value) || !filter.value.length)
		{
			return false;
		}
	},
	build: (query, method, filter, helpers) => query[method](function()
	{
		filter.value.forEach((value) => helpers.jsonContains(this, 'where', filter.field, value));
	})
});

filters.Item({
	id: 'OVERLAP',
	resolve,
	validate: (filter, validation) =>
	{
		validation.field(filter.field);

		if(!Array.isArray(filter.value) || !filter.value.length)
		{
			return false;
		}
	},
	build: (query, method, filter, helpers) => query[method](function()
	{
		filter.value.forEach((value) => helpers.jsonContains(this, 'orWhere', filter.field, value));
	})
});

filters.Item({
	id: 'HAS',
	resolve,
	validate: (filter, validation) => validation.field(filter.field),
	build: (query, method, filter, helpers) => helpers.jsonContains(query, method, filter.field, filter.value)
});
