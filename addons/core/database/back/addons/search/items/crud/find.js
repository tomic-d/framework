import crud from '#database/addons/crud/addon.js';

crud.Item({
	id: 'search',
	type: ['find'],
	callback(chain, term)
	{
		chain.query.search = typeof term === 'string' && term.trim() ? term.trim() : null;
		return chain;
	}
});
