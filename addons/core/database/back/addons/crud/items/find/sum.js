import crud from '#database/addons/crud/addon.js';

crud.Item({
	id: 'sum',
	type: ['find'],
	async callback(chain, field)
	{
		return crud.Fn('aggregate', chain.query, 'sum', field);
	}
});
