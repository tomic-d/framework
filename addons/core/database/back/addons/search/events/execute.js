import onetype from '#framework/load.js';
import database from '#database/addon.js';

onetype.MiddlewareIntercept('@database.find.execute', async (middleware) =>
{
	const { knex, query } = middleware.value;

	if(!query.search)
	{
		return await middleware.next();
	}

	const fields = query.addon.Search();

	if(!fields || !fields.length)
	{
		throw onetype.Error(400, 'Search not configured on :addon:.', { addon: query.addon.name });
	}

	const term = '%' + query.search.replace(/[\\%_]/g, '\\$&') + '%';
	const columns = fields.map((field) => database.Fn('column', query.addon, field));

	knex.where(function()
	{
		for(let i = 0; i < columns.length; i++)
		{
			const method = i === 0 ? 'whereILike' : 'orWhereILike';
			this[method](columns[i], term);
		}
	});

	await middleware.next();
});
