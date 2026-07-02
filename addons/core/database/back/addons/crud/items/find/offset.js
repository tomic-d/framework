import crud from '#database/addons/crud/addon.js';

crud.Item({
	id: 'offset',
	type: ['find'],
	callback(chain, offset)
	{
		chain.query.offset = offset;
		return chain;
	}
});
