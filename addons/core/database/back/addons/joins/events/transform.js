import onetype from '#framework/load.js';
import joins from '../addon.js';

onetype.MiddlewareIntercept('@database.find.transform', async (middleware) =>
{
	const { records, query } = middleware.value;

	if(query.joins?.length)
	{
		middleware.value.records = await joins.Fn('build', records, query.joins);
	}

	await middleware.next();
});
