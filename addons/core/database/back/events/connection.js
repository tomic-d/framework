import Knex from 'knex';
import database from '#database/addon.js';

database.ItemOn('add', function(item)
{
	const client = item.Get('client');

	const config = {
		client,
		acquireConnectionTimeout: 1000,
		pool: {
			min: 0,
			max: 25,
			idleTimeoutMillis: 1000,
			acquireTimeoutMillis: 1000
		}
	};

	if(client === 'sqlite3' || client === 'better-sqlite3')
	{
		config.connection = { filename: item.Get('filename') };
		config.useNullAsDefault = true;
	}
	else
	{
		config.connection = {
			port: item.Get('port'),
			host: item.Get('hostname'),
			user: item.Get('username'),
			password: item.Get('password'),
			database: item.Get('database'),
		};
	}

	const knex = Knex(config);

	item.Set('connection', knex);
	item.Set('dialect', knex.client.dialect);
});
