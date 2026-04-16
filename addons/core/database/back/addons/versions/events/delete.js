import onetype from '#framework/load.js';

onetype.MiddlewareIntercept('@database.delete', async (middleware) =>
{
	const { item, transaction, addon } = middleware.value;
	const config = addon.Versions();

	if(!config)
	{
		return await middleware.next();
	}

	await transaction('database_versions').insert({
		addon: addon.name,
		entity_id: item.Get('id'),
		operation: 'delete',
		changes: { [config.delete]: { old: null, new: new Date().toISOString() } },
		language: null
	});

	await middleware.next();
});
