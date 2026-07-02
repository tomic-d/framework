import crud from '#database/addons/crud/addon.js';

crud.Item({
	id: 'distinct',
	type: ['find'],
	callback(chain, value = true)
	{
		chain.query.distinct = Boolean(value);
		return chain;
	}
});
