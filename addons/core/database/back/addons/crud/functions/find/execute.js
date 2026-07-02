import onetype from '#framework/load.js';
import crud from '#database/addons/crud/addon.js';

crud.Fn('execute', async function(query, build, empty = [])
{
	if(query.impossible)
	{
		return empty;
	}

	const knex = query.knex(query.from || query.addon.Table().name);

	build(knex);

	const middleware = await onetype.Middleware('@database.find.execute', { knex, query });

	if(middleware.errors.length)
	{
		throw middleware.errors[0];
	}

	return query.records !== undefined ? query.records : knex;
});
