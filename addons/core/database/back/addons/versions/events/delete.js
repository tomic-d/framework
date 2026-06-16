import onetype from '#framework/load.js';
import database from '#database/addon.js';

onetype.MiddlewareIntercept('@database.delete', async (middleware) =>
{
	const { item, transaction, addon } = middleware.value;
	const config = addon.Versions();

	if(!config)
	{
		return await middleware.next();
	}

	/* stamp in the engine's format (mysql DATETIME rejects ISO 'T..Z') so the
	   folded value Restore writes back into the column is always accepted */
	const stamp = (await database.Fn('operation', transaction, 'stamp'))();

	await transaction('database_versions').insert({
		addon: addon.name,
		entity_id: item.Get('id'),
		operation: 'delete',
		changes: { [config.delete]: { old: null, new: stamp } },
		language: null
	});

	await middleware.next();
});
