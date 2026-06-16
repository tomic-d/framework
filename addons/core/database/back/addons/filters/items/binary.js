import filters from '../addon.js';

/* Simple binary operators: query[method](field, sqlOperator, value). The value
   ones validate field + value; IN/NOT IN take an array, and an empty IN makes the
   whole query impossible (matches nothing). */

const simple = {
	'EQUALS': '=',
	'NOT EQUALS': '!=',
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
		validate: (filter, validation) =>
		{
			validation.field(filter.field);
			validation.value(filter.value);
		},
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
