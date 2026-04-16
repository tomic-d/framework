import onetype from '#framework/load.js';
import metrics from '../addon.js';

onetype.EmitOn('@database.find', ({ methods, query }) =>
{
	methods.metrics = async (field, interval, aggregate, value) =>
	{
		const from = query.from || query.table.name;
		const knex = query.knex(from);

		const middleware = await onetype.Middleware('@database.find.execute', { knex, query });

		if(middleware.errors.length)
		{
			throw middleware.errors[0];
		}

		return metrics.Fn('build', knex, query, field, interval, aggregate, value);
	};
});
