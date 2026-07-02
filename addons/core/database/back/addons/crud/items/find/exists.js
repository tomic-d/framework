import crud from '#database/addons/crud/addon.js';

crud.Item({
	id: 'exists',
	type: ['find'],
	async callback(chain)
	{
		chain.query.limit = 1;
		return (await chain.count()) > 0;
	}
});
