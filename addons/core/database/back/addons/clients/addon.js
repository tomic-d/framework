import onetype from '#framework/load.js';

const clients = onetype.Addon('database.clients', (addon) =>
{
	addon.Field('id', {
		type: 'string',
		required: true,
		description: 'Client key, the knex client name (pg, mysql2, better-sqlite3, sqlite3).'
	});

	addon.Field('name', {
		type: 'string',
		required: true,
		description: 'Human name of the client shown in the UI.'
	});

	addon.Field('stamp', {
		type: 'function',
		required: true,
		description: 'Format a Date for this client. (date) => string.'
	});

	addon.Field('insert', {
		type: 'function',
		required: true,
		description: 'Insert one row and return it. (trx, table, row) => row.'
	});

	addon.Field('jsonContains', {
		type: 'function',
		required: true,
		description: 'Apply a JSON-array containment predicate to a query. (query, method, field, value) => void.'
	});

	addon.Field('dateTrunc', {
		type: 'function',
		required: true,
		description: 'Truncate a timestamp column to an interval bucket as a raw expression. (knex, interval, field) => raw.'
	});

	addon.Field('now', {
		type: 'function',
		required: true,
		description: 'Portable now() default for a column. (knex) => raw.'
	});
});

export default clients;
