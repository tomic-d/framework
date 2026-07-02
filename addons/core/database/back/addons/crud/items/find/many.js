import onetype from '#framework/load.js';
import database from '#database/addon.js';
import crud from '#database/addons/crud/addon.js';

crud.Item({
	id: 'many',
	type: ['find'],
	async callback(chain, set = false)
	{
		const query = chain.query;

		const result = await crud.Fn('execute', query, (knex) =>
		{
			knex[query.distinct ? 'distinct' : 'select'](query.select || '*');

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
		});

		const rows = await result;
		let records = rows.map((record) => database.Fn('cast', query.addon, record));

		const after = await onetype.Middleware('@database.find.transform', { records, query });

		if(after.errors.length)
		{
			throw after.errors[0];
		}

		return after.value.records.map((data) => query.addon.ItemAdd(data, null, set, set));
	}
});
