import onetype from '#framework/load.js';

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
		throw new Error(`Search not configured on '${query.addon.name}'.`);
	}

	const term = '%' + query.search + '%';

	knex.where(function()
	{
		for(let i = 0; i < fields.length; i++)
		{
			const method = i === 0 ? 'whereRaw' : 'orWhereRaw';
			this[method]('??::text ILIKE ?', [fields[i], term]);
		}
	});

	await middleware.next();
});
