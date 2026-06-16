import onetype from '#framework/load.js';
import database from '#database/addon.js';

database.Fn('crud.update', async function(item, {connection = 'primary', language = null, languages = null, whitelist = null} = {})
{
	const { knex, table } = database.Fn('connection', item.addon, connection);
	const { fields, skip } = await database.Fn('fields.build', item, knex, { update: true, language, languages, whitelist });

	return knex.transaction(async (transaction) =>
	{
		const id = item.Get('id');
		const before = item.addon.Versions() ? database.Fn('cast', item.addon, knex, await transaction(table).where('id', id).first()) : null;

		await transaction(table).where('id', id).update(fields);

		database.Fn('fields.apply', item, knex, await transaction(table).where('id', id).first(), skip);

		const middleware = await onetype.Middleware('@database.update', { item, transaction, addon: item.addon, language, languages, before, skip });

		if(middleware.errors.length)
		{
			throw middleware.errors[0];
		}

		return item;
	});
});
