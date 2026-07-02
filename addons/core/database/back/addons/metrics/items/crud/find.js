import onetype from '#framework/load.js';
import crud from '#database/addons/crud/addon.js';
import metrics from '../../addon.js';

crud.Item({
	id: 'metrics',
	type: ['find'],
	async callback(chain, field, interval, aggregate, value)
	{
		const query = chain.query;

		if(query.impossible)
		{
			return [];
		}

		const from = query.from || query.addon.Table().name;
		const knex = query.knex(from);

		const middleware = await onetype.Middleware('@database.find.execute', { knex, query });

		if(middleware.errors.length)
		{
			throw middleware.errors[0];
		}

		return metrics.Fn('build', knex, query, field, interval, aggregate, value);
	}
});
