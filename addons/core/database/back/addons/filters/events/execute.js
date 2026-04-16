import onetype from '#framework/load.js';
import filters from '../addon.js';

onetype.MiddlewareIntercept('@database.find.execute', async (middleware) =>
{
	const { knex, query } = middleware.value;

	if(query.filters?.length)
	{
		filters.Fn('build', knex, query.filters);
	}

	await middleware.next();
});
