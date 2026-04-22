import onetype from '#framework/load.js';
import database from '#database/addon.js';

database.Fn('transaction', async function(callback, name = 'primary')
{
	const knex = database.ItemGet(name)?.Get('connection');

	if(!knex)
	{
		throw onetype.Error(400, 'Database connection :1: not found.', name);
	}

	return await knex.transaction(callback);
});
