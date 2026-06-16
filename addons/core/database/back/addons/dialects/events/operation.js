import onetype from '#framework/load.js';
import dialects from '../addon.js';

/* Claim database operations: resolve the item registered as "<dialect>:<operation>"
   for the connection's engine and hand its code back as the operation handler.
   The core only asked "who can do <operation>?" — this is the dialects answer. */

onetype.MiddlewareIntercept('@database.operation', async (middleware) =>
{
	const { knex, operation } = middleware.value;
	const dialect = knex.client.dialect;
	const item = Object.values(dialects.Items()).find((item) => item.Get('dialect') === dialect && item.Get('operation') === operation);

	if(item)
	{
		middleware.value.handler = item.Get('code');
	}

	await middleware.next();
});
