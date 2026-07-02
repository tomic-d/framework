import onetype from '#framework/load.js';
import database from '#database/addon.js';

database.Fn('connection', function(connection = 'primary', callback = null)
{
	const knex = typeof connection === 'string' ? database.ItemGet(connection)?.Get('connection') : connection;

	if(!knex)
	{
		throw onetype.Error(400, 'Database connection :1: not found.', connection);
	}

	return callback ? callback(knex) : knex;
});
