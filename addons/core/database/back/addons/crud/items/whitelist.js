import crud from '#database/addons/crud/addon.js';

crud.Item({
	id: 'whitelist',
	type: ['update'],
	callback(chain, fields)
	{
		chain.context.whitelist = fields;
		return chain;
	}
});
