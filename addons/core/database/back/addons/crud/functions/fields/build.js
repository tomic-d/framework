import onetype from '#framework/load.js';
import database from '#database/addon.js';
import crud from '#database/addons/crud/addon.js';

crud.Fn('fields.build', function(item, knex, { update = false, whitelist = null } = {})
{
	const stamp = knex.client.config.stamp;
	const fields = {};
	const skip = new Set();

	const primary = item.addon.Sync().primary;

	for(const field of Object.values(item.addon.Fields().data))
	{
		if(primary.fields.includes(field.name) && (primary.auto || update))
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
