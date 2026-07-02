import onetype from '#framework/load.js';
import crud from '#database/addons/crud/addon.js';

crud.Item({
	id: 'limit',
	type: ['find'],
	callback(chain, limit)
	{
		if(typeof limit !== 'number' || !Number.isInteger(limit) || limit <= 0)
		{
			throw onetype.Error(400, 'Limit must be a positive integer, received :limit:.', { limit });
		}

		chain.query.limit = limit;
		return chain;
	}
});
