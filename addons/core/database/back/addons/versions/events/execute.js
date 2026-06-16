import onetype from '#framework/load.js';
import versions from '../addon.js';

onetype.MiddlewareIntercept('@database.find.execute', async (middleware) =>
{
	const { knex, query } = middleware.value;
	const config = query.addon.Versions();

	if(!config)
	{
		return await middleware.next();
	}

	/* Time-travel: reconstruct every entity's state at the cutoff by folding diff
	   rows in JS (multi-db, no LATERAL / DISTINCT ON / jsonb pivot). This is the
	   cold path (1:1000), so in-memory filter/sort/paginate is acceptable.
	   Sets query.records so find/execute skips the SQL read. */
	if(query.versionId)
	{
		const alive = await versions.Fn('fold.many', query.knex, query.addon, query.versionId);

		let records = Object.entries(alive).map(([entityId, state]) => ({ ...state, id: entityId }));

		if(query.filters?.children?.length)
		{
			records = records.filter((record) => versions.Fn('match', record, query.filters));
		}

		if(query.sort)
		{
			const { field, direction } = query.sort;
			const sign = String(direction).toLowerCase() === 'desc' ? -1 : 1;
			records.sort((a, b) => (a[field] > b[field] ? 1 : a[field] < b[field] ? -1 : 0) * sign);
		}

		/* full filtered count before pagination, so count()/plain().total reflect the
		   folded historical set, not the live physical rows */
		query.total = records.length;

		const offset = query.offset || (query.page > 1 ? (query.page - 1) * query.limit : 0);

		if(query.limit > 0)
		{
			records = records.slice(offset, offset + query.limit);
		}

		query.records = records;

		return await middleware.next();
	}

	/* Live read: hide soft-deleted rows. */
	knex.whereNull(config.delete);

	await middleware.next();
});
