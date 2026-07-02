import database from '#database/addon.js';
import crud from '#database/addons/crud/addon.js';

crud.Fn('create', async function(chain)
{
	const item = chain.item;
	const knex = database.Fn('connection', chain.connection || 'primary');
	const table = item.addon.Table().name;
	const insert = knex.client.config.insert;
	const id = item.Get('id');
	const { fields } = await crud.Fn('fields.build', item, knex);

	return knex.transaction(async (transaction) =>
	{
		const hooks = { ...chain.context, item, transaction, addon: item.addon, skip: false };

		await crud.Fn('hook', '@database.create.before', hooks);

		if(!hooks.skip)
		{
			crud.Fn('fields.apply', item, await insert(transaction, table, fields));
		}

		item.addon.ItemRemove(id, false);

		const created = item.addon.ItemAdd({ id: item.Get('id') }, null, false);
		created.data = item.data;
		created.store = item.store;

		hooks.item = created;

		await crud.Fn('hook', '@database.create.after', hooks);

		return created;
	});
});
