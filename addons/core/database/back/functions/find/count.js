import onetype from '#framework/load.js';
import database from '#database/addon.js';

database.Fn('find.count', async function(query)
{
	const from = query.from || query.table.name;
	const knex = query.knex(from).count('* as count');

	const middleware = await onetype.Middleware('@database.find.execute', { knex, query });

	if(middleware.errors.length)
	{
		throw middleware.errors[0];
	}

	const result = await knex;
	return parseInt(result[0]?.count || 0);
});
