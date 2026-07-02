import database from '#database/addon.js';
import crud from '#database/addons/crud/addon.js';

crud.Fn('delete', async function(chain)
{
	const item = chain.item;
	const knex = database.Fn('connection', chain.connection || 'primary');
	const table = item.addon.Table().name;

	return knex.transaction(async (transaction) =>
	{
		const id = item.Get('id');
		const hooks = { ...chain.context, item, transaction, addon: item.addon, write: true };

		await crud.Fn('hook', '@database.delete.before', hooks);

		if(hooks.write)
		{
			await transaction(table).where('id', id).del();
			item.Set('id', null);
		}

		await crud.Fn('hook', '@database.delete.after', hooks);

		return item;
	});
});
