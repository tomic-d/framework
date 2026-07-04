import filters from '../../addon.js';

const resolve = (knex, helpers) =>
{
	helpers.jsonContains = knex.client.config.jsonContains;
};

filters.Item({
	id: 'CONTAINS',
	resolve,
	validate: (filter, validation) =>
	{
		validation.field(filter.field);

		if(!Array.isArray(filter.value))
		{
			filter.value = filter.value === null || filter.value === undefined || filter.value === '' ? [] : [filter.value];
		}

		if(!filter.value.length)
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

		if(!Array.isArray(filter.value))
		{
			filter.value = filter.value === null || filter.value === undefined || filter.value === '' ? [] : [filter.value];
		}

		if(!filter.value.length)
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
