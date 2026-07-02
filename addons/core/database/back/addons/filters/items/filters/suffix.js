import filters from '../../addon.js';

/* Operators applied through a knex method suffix (whereNull, whereBetween,
   whereILike, ...) rather than field-operator-value. */

filters.Item({
	id: 'NULL',
	validate: (filter, validation) => validation.field(filter.field),
	build: (query, method, filter) => query[method + 'Null'](filter.field)
});

filters.Item({
	id: 'NOT NULL',
	validate: (filter, validation) => validation.field(filter.field),
	build: (query, method, filter) => query[method + 'NotNull'](filter.field)
});

filters.Item({
	id: 'BETWEEN',
	validate: (filter, validation) =>
	{
		validation.field(filter.field);
		validation.between(filter.value);
	},
	build: (query, method, filter) => query[method + 'Between'](filter.field, filter.value)
});

filters.Item({
	id: 'NOT BETWEEN',
	validate: (filter, validation) =>
	{
		validation.field(filter.field);
		validation.between(filter.value);
	},
	build: (query, method, filter) => query[method + 'NotBetween'](filter.field, filter.value)
});

filters.Item({
	id: 'ILIKE',
	validate: (filter, validation) =>
	{
		validation.field(filter.field);
		validation.value(filter.value);
	},
	build: (query, method, filter) => query[method + 'ILike'](filter.field, filter.value)
});

filters.Item({
	id: 'NOT ILIKE',
	validate: (filter, validation) =>
	{
		validation.field(filter.field);
		validation.value(filter.value);
	},
	build: (query, method, filter) => query[method + 'NotILike'](filter.field, filter.value)
});
