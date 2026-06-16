import onetype from '#framework/load.js';
import database from '#database/addon.js';

/* Build the column->value map to write, from an item's fields. Skips id, virtual
   fields, and (on update) created_at + whitelisted-out + per-field-skipped fields.
   Serializes object/array to JSON, stamps created/updated timestamps. Returns
   { fields, skip } where skip is the set of fields NOT written. */

database.Fn('fields.build', async function(item, knex, { update = false, language = null, languages = null, whitelist = null } = {})
{
	const stamp = await database.Fn('operation', knex, 'stamp');
	const fields = {};
	const skip = new Set();

	/* an auto-increment PK is assigned by the DB, so it is never written; an
	   app-supplied PK (auto:false) must be written on create. The PK is never
	   written on update. */
	const primary = item.addon.Primary();

	for(const field of Object.values(item.addon.Fields().data))
	{
		if(field.name === primary.field && (primary.auto || update))
		{
			continue;
		}

		if(update && (field.name === 'created' || field.name === 'created_at'))
		{
			continue;
		}

		const parsed = onetype.DataParseConfig(field.define);

		if(parsed.virtual)
		{
			skip.add(field.name);
			continue;
		}

		if(update && whitelist && !whitelist.includes(field.name))
		{
			skip.add(field.name);
			continue;
		}

		if(update)
		{
			const result = await onetype.Middleware('@database.update.field', { field, item, addon: item.addon, language, languages, skip: false });

			if(result.errors.length)
			{
				throw result.errors[0];
			}

			if(result.value.skip)
			{
				skip.add(field.name);
				continue;
			}
		}

		try
		{
			fields[field.name] = database.Fn('serialize', item.Get(field.name), parsed.type.split('|')[0]);
		}
		catch(error)
		{
			throw onetype.Error(500, 'Field :field: error: :reason:.', { field: field.name, reason: error.message });
		}
	}

	const stamps = update ? ['updated', 'updated_at'] : ['created', 'created_at', 'updated', 'updated_at'];

	stamps.forEach((name) =>
	{
		if(item.addon.FieldGet(name))
		{
			fields[name] = stamp();
		}
	});

	return { fields, skip };
});
