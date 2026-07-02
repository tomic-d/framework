import crud from '#database/addons/crud/addon.js';

crud.Item({
	id: 'one',
	type: ['find'],
	async callback(chain, set = false)
	{
		chain.query.limit = 1;
		const results = await chain.many(set);
		return results.length > 0 ? results[0] : null;
	}
});
