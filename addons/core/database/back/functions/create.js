import onetype from '#framework/load.js';
import database from '#database/addon.js';

database.Fn('create', async function(item, {connection = 'primary', language = null, languages = null} = {})
{
	const { knex, table } = database.Fn('connection', item.addon, connection);
	const id = item.Get('id');
	const fields = {};

	Object.values(item.addon.Fields().data).forEach((field) =>
	{
		if(field.name === 'id')
		{
			return;
		}

		const parsed = onetype.DataParseConfig(field.define);

		if(parsed.virtual)
		{
			return;
		}

		try
		{
			fields[field.name] = item.Get(field.name);
		}
		catch(error)
		{
			throw onetype.Error(500, 'Field :field: error: :reason:.', { field: field.name, reason: error.message });
		}
	});

	['updated', 'created', 'updated_at', 'created_at'].forEach((name) =>
	{
		if(item.addon.FieldGet(name))
		{
			fields[name] = new Date().toISOString();
		}
	});

	return knex.transaction(async (transaction) =>
	{
		const [record] = await transaction(table).insert(fields).returning('*');

		Object.entries(record).forEach(([key, value]) =>
		{
			item.Set(key, value instanceof Date ? value.toISOString() : value);
		});

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
