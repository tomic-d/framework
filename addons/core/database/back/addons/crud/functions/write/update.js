import database from '#database/addon.js';
import crud from '#database/addons/crud/addon.js';

crud.Fn('update', async function(chain)
{
	const item = chain.item;
	const knex = database.Fn('connection', chain.connection || 'primary');
	const table = item.addon.Table().name;
	const { fields, skip } = await crud.Fn('fields.build', item, knex, { update: true, whitelist: chain.context.whitelist || null });

	return knex.transaction(async (transaction) =>
	{
		const id = item.Get('id');
		const hooks = { ...chain.context, item, transaction, addon: item.addon, fields, skip, write: true };

		await crud.Fn('hook', '@database.update.before', hooks);

		if(hooks.write)
		{
			await transaction(table).where('id', id).update(fields);
			crud.Fn('fields.apply', item, await transaction(table).where('id', id).first(), skip);
		}

		await crud.Fn('hook', '@database.update.after', hooks);

		return item;
	});
});
