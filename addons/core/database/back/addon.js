import onetype from '#framework/load.js';

const database = onetype.Addon('database', (addon) =>
{
	addon.Field('id', {
		type: 'string',
		required: true,
		description: 'Connection id used everywhere as { connection: id } (e.g. "primary").'
	});

	addon.Field('client', {
		type: 'string',
		value: 'pg',
		description: 'Database driver key (pg, mysql2, better-sqlite3, sqlite3). Resolved to a database.clients item by the connection event.'
	});

	addon.Field('hostname', {
		type: 'string',
		description: 'Server host for pg/mysql connections.'
	});

	addon.Field('port', {
		type: 'number',
		value: 5432,
		description: 'Server port for pg/mysql connections.'
	});

	addon.Field('username', {
		type: 'string',
		description: 'User for pg/mysql connections.'
	});

	addon.Field('password', {
		type: 'string',
		description: 'Password for pg/mysql connections.'
	});

	addon.Field('database', {
		type: 'string',
		description: 'Database name for pg/mysql connections.'
	});

	addon.Field('filename', {
		type: 'string',
		description: 'File path for sqlite connections.'
	});

	addon.Field('connection', {
		type: 'function|object',
		description: 'Live knex instance, set by the connection event once built.'
	});

	addon.Field('dialect', {
		type: 'string',
		options: ['postgresql', 'mysql', 'sqlite3'],
		description: 'Resolved knex dialect, set once the connection is built.'
	});
});

export default database;