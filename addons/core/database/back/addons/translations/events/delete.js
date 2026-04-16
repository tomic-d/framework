import onetype from '#framework/load.js';

onetype.MiddlewareIntercept('@database.delete', async (middleware) =>
{
	const { item, transaction, addon } = middleware.value;
	const fields = addon.Translations();

	if(!fields)
	{
		return await middleware.next();
	}

	await transaction('database_translations')
		.where({ entity: addon.name, entity_id: String(item.Get('id')) })
		.del();

	await middleware.next();
});
