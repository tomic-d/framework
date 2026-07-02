import Knex from 'knex';
import database from '#database/addon.js';
import clients from '#database/addons/clients/addon.js';

database.ItemOn('add', function(item)
{
	const id = item.Get('client');
	const client = clients.ItemGet(id);

	const config = {
		client: id,
		acquireConnectionTimeout: 1000,
		pool: {
			min: 0,
			max: 25,
			idleTimeoutMillis: 1000,
			acquireTimeoutMillis: 1000
		}
	};

	if(id === 'sqlite3' || id === 'better-sqlite3')
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

	Object.assign(knex.client.config, client.GetData());

	item.Set('connection', knex);
	item.Set('dialect', knex.client.dialect);
});
