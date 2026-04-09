import onetype from '#framework/load.js';
import database from '#database/addon.js';

database.Fn('item.delete', async function(item, {connection = 'primary'} = {})
{
	const knex = database.ItemGet(connection)?.Get('connection');
	const { table, translations } = item.addon.database;

	if(!knex)
	{
		throw onetype.Error(400, 'Database :1 not found.', connection);
	}

	if(!table)
	{
		throw onetype.Error(400, 'Addon :1 must have table name set.', item.addon.name);
	}

	return knex.transaction(async (trx) =>
	{
		if(translations)
		{
			await trx('translations')
				.where({entity: item.addon.name, entity_id: String(item.Get('id'))})
				.del();
		}

		await trx(table.name).where('id', item.Get('id')).del();

		item.Set('id', null);

		return item;
	});
});
