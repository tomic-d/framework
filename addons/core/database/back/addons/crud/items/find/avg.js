import crud from '#database/addons/crud/addon.js';

crud.Item({
	id: 'avg',
	type: ['find'],
	async callback(chain, field)
	{
		return crud.Fn('aggregate', chain.query, 'avg', field);
	}
});
