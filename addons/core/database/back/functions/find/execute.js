import onetype from '#framework/load.js';
import database from '#database/addon.js';

database.Fn('find.execute', async function(query)
{
	const from = query.from || query.table.name;
	const knex = query.knex(from);

	if(query.select)
	{
		knex[query.distinct ? 'distinct' : 'select'](query.select);
	}
	else
	{
		knex[query.distinct ? 'distinct' : 'select']('*');
	}

	if(query.sort)
	{
		knex.orderBy(query.sort.field, query.sort.direction);
	}

	if(query.limit > 0)
	{
		knex.limit(query.limit);

		if(query.offset)
		{
			knex.offset(query.offset);
		}
		else if(query.page > 1)
		{
			knex.offset((query.page - 1) * query.limit);
		}
	}

	const before = await onetype.Middleware('@database.find.execute', { knex, query });

	if(before.errors.length)
	{
		throw before.errors[0];
	}

	const result = await knex;

	let records = result.map((record) =>
	{
		const data = {};

		Object.entries(record).forEach(([key, value]) =>
		{
			data[key] = value instanceof Date ? value.toISOString() : value;
		});

		return data;
	});

	const after = await onetype.Middleware('@database.find.transform', { records, query });

	if(after.errors.length)
	{
		throw after.errors[0];
	}

	return after.value.records;
});
