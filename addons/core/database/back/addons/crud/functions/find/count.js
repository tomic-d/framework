import onetype from '#framework/load.js';
import database from '#database/addon.js';

database.Fn('find.count', async function(query)
{
	if(query.impossible)
	{
		return 0;
	}

	const from = query.from || query.table.name;
	const knex = query.knex(from).count('* as count');

	const middleware = await onetype.Middleware('@database.find.execute', { knex, query });

	if(middleware.errors.length)
	{
		throw middleware.errors[0];
	}

	/* time-travel fold counts the reconstructed set in JS (set by the versions
	   middleware), not the live physical rows the self-built knex would count */
	if(query.total !== undefined)
	{
		return query.total;
	}

	const result = await knex;
	return parseInt(result[0]?.count || 0);
});
