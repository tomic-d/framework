import onetype from '#framework/load.js';
import database from '#database/addon.js';

database.Fn('delete', async function(item, {connection = 'primary'} = {})
{
	const { knex, table } = database.Fn('connection', item.addon, connection);
	const versions = item.addon.Versions();

	return knex.transaction(async (transaction) =>
	{
		let before = null;

		if(versions)
		{
			before = await transaction(table).where('id', item.Get('id')).first();

			await transaction(table).where('id', item.Get('id')).update({
				[versions.delete]: new Date().toISOString()
			});
		}
		else
		{
			await transaction(table).where('id', item.Get('id')).del();
		}

		const middleware = await onetype.Middleware('@database.delete', { item, transaction, addon: item.addon, before });

		if(middleware.errors.length)
		{
			throw middleware.errors[0];
		}

		if(!versions)
		{
			item.Set('id', null);
		}

		return item;
	});
});
