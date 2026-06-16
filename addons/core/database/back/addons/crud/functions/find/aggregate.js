import onetype from '#framework/load.js';
import database from '#database/addon.js';

database.Fn('find.aggregate', async function(query, type, field)
{
	const validation = database.Fn('validation');
	validation.field(field);

	if(query.impossible)
	{
		return 0;
	}

	const from = query.from || query.table.name;
	const knex = query.knex(from)[type](`${field} as result`);

	const middleware = await onetype.Middleware('@database.find.execute', { knex, query });

	if(middleware.errors.length)
	{
		throw middleware.errors[0];
	}

	const result = await knex;
	return parseFloat(result[0]?.result || 0);
});
