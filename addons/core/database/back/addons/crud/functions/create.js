import onetype from '#framework/load.js';
import database from '#database/addon.js';

database.Fn('crud.create', async function(item, {connection = 'primary', language = null, languages = null} = {})
{
	const { knex, table } = database.Fn('connection', item.addon, connection);
	const insert = await database.Fn('operation', knex, 'insert');
	const id = item.Get('id');
	const { fields } = await database.Fn('fields.build', item, knex);

	return knex.transaction(async (transaction) =>
	{
		database.Fn('fields.apply', item, knex, await insert(transaction, table, fields));

		const middleware = await onetype.Middleware('@database.create', { item, transaction, addon: item.addon, language, languages });

		if(middleware.errors.length)
		{
			throw middleware.errors[0];
		}

		item.addon.ItemRemove(id, false);

		const created = item.addon.ItemAdd({id: item.Get('id')}, null, false);
		created.data = item.data;
		created.store = item.store;

		return created;
	});
});
