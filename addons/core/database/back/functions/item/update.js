import onetype from '#framework/load.js';
import database from '#database/addon.js';

database.Fn('item.update', async function(item, {connection = 'primary', translation = 'en'} = {})
{
	const fields = {};
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

	const isDefault = translation === onetype.Language();

	Object.values(item.addon.Fields().data).forEach((field) =>
	{
		if(field.name === 'id')
		{
			return;
		}

		if(translations && !isDefault && translations.includes(field.name))
		{
			return;
		}

		try
		{
			fields[field.name] = item.Get(field.name);
		}
		catch(error)
		{
			throw onetype.Error(500, 'Error in field: ' + field.name + ': ' + error.message);
		}
	});

	['updated', 'updated_at'].forEach((field) =>
	{
		if(item.addon.FieldGet(field))
		{
			fields[field] = new Date().toISOString();
		}
	});

	return knex.transaction(async (trx) =>
	{
		const [record] = await trx(table.name).where('id', item.Get('id')).update(fields).returning('*');

		Object.entries(record).forEach(([key, value]) =>
		{
			if(translations && !isDefault && translations.includes(key))
			{
				return;
			}

			if(value instanceof Date)
			{
				value = value.toISOString();
			}

			item.Set(key, value);
		});

		if(translations)
		{
			const rows = translations
				.filter(field => item.Get(field) !== null && item.Get(field) !== undefined)
				.map(field => ({
					entity: item.addon.name,
					entity_id: String(item.Get('id')),
					language: translation,
					field,
					value: String(item.Get(field)),
					updated_at: new Date().toISOString()
				}));

			if(rows.length)
			{
				await trx('translations')
					.insert(rows)
					.onConflict(['entity', 'entity_id', 'language', 'field'])
					.merge(['value', 'updated_at']);
			}
		}

		return item;
	});
});
