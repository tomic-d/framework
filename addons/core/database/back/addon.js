import onetype from '#framework/load.js';

const database = onetype.Addon('database', (addon) =>
{
	addon.Field('id', {
		type: 'string',
		required: true,
		description: 'Connection id used everywhere as { connection: id } (e.g. "primary").'
	});

	addon.Field('hostname', {
		type: 'string',
		description: 'Server host.'
	});

	addon.Field('port', {
		type: 'number',
		value: 5432,
		description: 'Server port.'
	});

	addon.Field('username', {
		type: 'string',
		description: 'User.'
	});

	addon.Field('password', {
		type: 'string',
		description: 'Password.'
	});

	addon.Field('database', {
		type: 'string',
		description: 'Database name.'
	});

	addon.Field('connection', {
		type: 'function|object',
		description: 'Live knex instance, set by the connection event once built.'
	});
});

export default database;
