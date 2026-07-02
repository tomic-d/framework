import onetype from '#framework/load.js';
import database from '#database/addon.js';
import crud from '#database/addons/crud/addon.js';

crud.Fn('chain', function(operation, state)
{
	const chain = {
		operation,
		context: {},
		...state
	};

	if(operation === 'find')
	{
		const connection = chain.connection || 'primary';

		chain.query = {
			addon: chain.addon,
			knex: typeof connection === 'string' ? database.ItemGet(connection)?.Get('connection') : connection,
			sort: null,
			search: null,
			limit: 250,
			page: 1,
			offset: null,
			distinct: false,
			select: null
		};
	}

	const items = Object.values(crud.Items())
		.filter((item) => item.Get('type').includes(operation))
		.sort((a, b) => a.Get('order') - b.Get('order'));

	for(const item of items)
	{
		const callback = item.Get('callback');

		chain[item.Get('id')] = (...args) => callback(chain, ...args);
	}

	if(operation === 'find')
	{
		onetype.Emit('@database.find', { methods: chain, query: chain.query, addon: chain.addon });
	}
	else
	{
		chain.then = (resolve, reject) => crud.Fn('run', chain).then(resolve, reject);
	}

	return chain;
});
