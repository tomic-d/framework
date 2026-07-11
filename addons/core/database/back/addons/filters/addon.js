import onetype from '#framework/load.js';

/* Filters: the WHERE-clause pipeline plus its operator vocabulary. Each item IS
   one operator (id = the operator token, e.g. 'EQUALS', 'NEAR'). build.js iterates
   these instead of a hardcoded if/else, so a plugin adds an operator with one item,
   no core patch. Last registration of an id wins. */

const filters = onetype.Addon('database.filters', (addon) =>
{
	addon.Field('id', {
		type: 'string',
		required: true,
		description: 'Operator token, uppercase, the lookup key (EQUALS, CONTAINS, NEAR).'
	});

	addon.Field('order', {
		type: 'number',
		value: 100,
		description: 'Resolution order when iterating; lower runs first.'
	});

	addon.Field('validate', {
		type: 'function',
		description: 'Optional (filter, validation, query) => void|false. Validates input; returns false to skip the filter; may set query.impossible.'
	});

	addon.Field('build', {
		type: 'function',
		required: true,
		description: 'Synchronous (query, method, filter) => void. Applies the operator to the knex query inside its callback.'
	});
});

export default filters;
