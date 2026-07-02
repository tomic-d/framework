import onetype from '#framework/load.js';
import versions from '#database/addons/versions/addon.js';

onetype.MiddlewareIntercept('@database.find.execute', async (middleware) =>
{
	const { knex, query } = middleware.value;
	const config = query.addon.Versions();

	if(!config)
	{
		return await middleware.next();
	}

	if(query.versionId)
	{
		const alive = await versions.Fn('get.fold.many', query.knex, query.addon, query.versionId);

		let records = Object.entries(alive).map(([entityId, state]) => ({ ...state, id: entityId }));

		if(query.filters?.children?.length)
		{
			records = records.filter((record) => versions.Fn('get.match', record, query.filters));
		}

		if(query.sort)
		{
			const { field, direction } = query.sort;
			const sign = String(direction).toLowerCase() === 'desc' ? -1 : 1;
			records.sort((a, b) => (a[field] > b[field] ? 1 : a[field] < b[field] ? -1 : 0) * sign);
		}

		query.total = records.length;

		const offset = query.offset || (query.page > 1 ? (query.page - 1) * query.limit : 0);

		if(query.limit > 0)
		{
			records = records.slice(offset, offset + query.limit);
		}

		query.records = records;

		return await middleware.next();
	}

	knex.whereNull(config.delete);

	await middleware.next();
});
