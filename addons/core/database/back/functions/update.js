import onetype from '#framework/load.js';
import database from '#database/addon.js';

database.Fn('update', async function(item, {connection = 'primary', language = null, languages = null, whitelist = null} = {})
{
	const { knex, table } = database.Fn('connection', item.addon, connection);
	const fields = {};
	const skip = new Set();

	for(const field of Object.values(item.addon.Fields().data))
	{
		if(field.name === 'id')
		{
			continue;
		}

		const parsed = onetype.DataParseConfig(field.define);

		if(parsed.virtual)
		{
			skip.add(field.name);
			continue;
		}

		if(whitelist && !whitelist.includes(field.name))
		{
			skip.add(field.name);
			continue;
		}

		const result = await onetype.Middleware('@database.update.field', {
			field, item, addon: item.addon, language, languages, skip: false
		});

		if(result.errors.length)
		{
			throw result.errors[0];
		}

		if(result.value.skip)
		{
			skip.add(field.name);
			continue;
		}

		try
		{
			fields[field.name] = item.Get(field.name);
		}
		catch(error)
		{
			throw onetype.Error(500, 'Field :field: error: :reason:.', { field: field.name, reason: error.message });
		}
	}

	['updated', 'updated_at'].forEach((name) =>
	{
		if(item.addon.FieldGet(name))
		{
			fields[name] = new Date().toISOString();
		}
	});

	return knex.transaction(async (transaction) =>
	{
		let before = null;

		if(item.addon.Versions())
		{
			before = await transaction(table).where('id', item.Get('id')).first();
		}

		const [record] = await transaction(table).where('id', item.Get('id')).update(fields).returning('*');

		Object.entries(record).forEach(([key, value]) =>
		{
			if(skip.has(key))
			{
				return;
			}

			item.Set(key, value instanceof Date ? value.toISOString() : value);
		});

		const middleware = await onetype.Middleware('@database.update', { item, transaction, addon: item.addon, language, languages, before });

		if(middleware.errors.length)
		{
			throw middleware.errors[0];
		}

		return item;
	});
});
