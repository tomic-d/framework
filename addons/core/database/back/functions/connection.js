import onetype from '#framework/load.js';
import database from '#database/addon.js';

database.Fn('connection', function(addon, connection = 'primary')
{
	const knex = typeof connection === 'string' ? database.ItemGet(connection)?.Get('connection') : connection;
	const table = addon.Table();

	if(!knex)
	{
		throw onetype.Error(400, 'Database connection :1: not found.', connection);
	}

	if(!table)
	{
		throw onetype.Error(400, 'Addon :1: has no table set.', addon.name);
	}

	return { knex, table: table.name };
});
