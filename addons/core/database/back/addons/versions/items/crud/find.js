import crud from '#database/addons/crud/addon.js';

crud.Item({
	id: 'version',
	type: ['find'],
	callback(chain, id)
	{
		chain.query.versionId = id;
		return chain;
	}
});
