import filters from '../../addon.js';

/* JSON-array containment over a jsonb column (pg @> via knex whereJsonSupersetOf). */

filters.Item({
	id: 'CONTAINS',
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
	build: (query, method, filter) => query[method](function()
	{
		filter.value.forEach((value) => this.whereJsonSupersetOf(filter.field, [value]));
	})
});

filters.Item({
	id: 'OVERLAP',
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
	build: (query, method, filter) => query[method](function()
	{
		filter.value.forEach((value) => this.orWhereJsonSupersetOf(filter.field, [value]));
	})
});

filters.Item({
	id: 'HAS',
	validate: (filter, validation) => validation.field(filter.field),
	build: (query, method, filter) => query[method + 'JsonSupersetOf'](filter.field, Array.isArray(filter.value) ? filter.value : [filter.value])
});
