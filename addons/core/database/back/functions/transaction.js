import database from '#database/addon.js';

database.Fn('transaction', async function(name = 'primary', callback)
{
	const knex = database.Fn('connection', name);

	return await knex.transaction(callback);
});
