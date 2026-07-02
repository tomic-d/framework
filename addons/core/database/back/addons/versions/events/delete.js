import onetype from '#framework/load.js';
import versions from '#database/addons/versions/addon.js';

onetype.MiddlewareIntercept('@database.delete.before', async (middleware) =>
{
	const { item, transaction, addon } = middleware.value;
	const config = addon.Versions();

	if(!config)
	{
		return await middleware.next();
	}

	const stamp = transaction.client.config.stamp();

	await transaction(addon.Table().name).where('id', item.Get('id')).update({ [config.delete]: stamp });

	await versions.Fn('apply.write', transaction, addon, {
		entity: item.Get('id'),
		operation: 'delete',
		changes: { [config.delete]: { old: null, new: stamp } }
	});

	middleware.value.write = false;

	await middleware.next();
});
