import filters from '../../addon.js';

/* Simple binary operators: query[method](field, sqlOperator, value). The value
   ones validate field + value; EQUALS and NOT EQUALS treat null as IS NULL /
   IS NOT NULL (SQL = null never matches); IN/NOT IN take an array, and an empty
   IN makes the whole query impossible (matches nothing). */

const validate = (filter, validation) =>
{
	validation.field(filter.field);
	validation.value(filter.value);
};

filters.Item({
	id: 'EQUALS',
	validate,
	build: (query, method, filter) => filter.value === null
		? query[method + 'Null'](filter.field)
		: query[method](filter.field, '=', filter.value)
});

filters.Item({
	id: 'NOT EQUALS',
	validate,
	build: (query, method, filter) => filter.value === null
		? query[method + 'NotNull'](filter.field)
		: query[method](filter.field, '!=', filter.value)
});

const simple = {
	'LESS': '<',
	'GREATER': '>',
	'LESS EQUALS': '<=',
	'GREATER EQUALS': '>=',
	'LIKE': 'like',
	'NOT LIKE': 'not like'
};

Object.entries(simple).forEach(([id, sql]) =>
{
	filters.Item({
		id,
		validate,
		build: (query, method, filter) => query[method](filter.field, sql, filter.value)
	});
});

filters.Item({
	id: 'IN',
	validate: (filter, validation, query) =>
	{
		validation.field(filter.field);

		if(!Array.isArray(filter.value) || !filter.value.length)
		{
			query.impossible = true;
			return false;
		}
	},
	build: (query, method, filter) => query[method](filter.field, 'in', filter.value)
});

filters.Item({
	id: 'NOT IN',
	validate: (filter, validation) =>
	{
		validation.field(filter.field);

		if(!Array.isArray(filter.value) || !filter.value.length)
		{
			return false;
		}
	},
	build: (query, method, filter) => query[method](filter.field, 'not in', filter.value)
});
