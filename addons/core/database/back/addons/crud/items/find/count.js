import crud from '#database/addons/crud/addon.js';

crud.Item({
	id: 'count',
	type: ['find'],
	async callback(chain)
	{
		const query = chain.query;
		const result = await crud.Fn('execute', query, (knex) => knex.count('* as count'), 0);

		if(query.total !== undefined)
		{
			return query.total;
		}

		return typeof result === 'number' ? result : parseInt(result[0]?.count || 0);
	}
});
