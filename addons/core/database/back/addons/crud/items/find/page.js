import onetype from '#framework/load.js';
import crud from '#database/addons/crud/addon.js';

crud.Item({
	id: 'page',
	type: ['find'],
	callback(chain, page)
	{
		if(typeof page !== 'number' || !Number.isInteger(page) || page < 1)
		{
			throw onetype.Error(400, 'Page must be >= 1, received :page:.', { page });
		}

		chain.query.page = page;
		return chain;
	}
});
