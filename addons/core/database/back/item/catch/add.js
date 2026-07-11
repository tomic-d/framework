import Knex from 'knex';
import database from '#database/addon.js';

database.ItemOn('add', function(item)
{
	const knex = Knex({
		client: 'pg',
		acquireConnectionTimeout: 1000,
		pool: {
			min: 0,
			max: 25,
			idleTimeoutMillis: 1000,
			acquireTimeoutMillis: 1000
		},
		connection: {
			port: item.Get('port'),
			host: item.Get('hostname'),
			user: item.Get('username'),
			password: item.Get('password'),
			database: item.Get('database')
		}
	});

	item.Set('connection', knex);
});
