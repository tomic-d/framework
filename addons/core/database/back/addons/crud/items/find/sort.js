import onetype from '#framework/load.js';
import crud from '#database/addons/crud/addon.js';

crud.Item({
	id: 'sort',
	type: ['find'],
	callback(chain, field, direction = 'asc')
	{
		crud.Fn('validate.field', field);

		direction = String(direction).toLowerCase();

		if(!['asc', 'desc'].includes(direction))
		{
			throw onetype.Error(400, 'Invalid sort direction :direction:.', { direction });
		}

		chain.query.sort = { field, direction };
		return chain;
	}
});
