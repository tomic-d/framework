import onetype from '#framework/load.js';
import database from '#database/addon.js';
import crud from '#database/addons/crud/addon.js';
import schema from '#database/addons/schema/addon.js';

crud.Fn('fields.build', function(item, { update = false, whitelist = null } = {})
{
	const fields = {};
	const skip = new Set();
	const map = database.Fn('map', item.addon);
	const { columns } = schema.Fn('parse', item.addon.Schema());

	for(const column of columns)
	{
		if(column.primary && (column.auto || update))
		{
			continue;
		}

		const name = map[column.name] || column.name;

		if(update && (name === 'created' || name === 'created_at'))
		{
			continue;
		}

		const field = item.addon.FieldGet(name);

		if(!field)
		{
			continue;
		}

		const parsed = onetype.DataParseConfig(field.define);

		if(update && whitelist && !whitelist.includes(name) && !parsed.metadata?.spread)
		{
			skip.add(name);
			continue;
		}

		try
		{
			if(parsed.metadata?.spread)
			{
				fields[column.name] = JSON.stringify(crud.Fn('fields.bag', item, columns));
			}
			else
			{
				fields[column.name] = column.array ? item.Get(name) : database.Fn('serialize', item.Get(name), parsed.type.split('|')[0]);
			}
		}
		catch(error)
		{
			throw onetype.Error(500, 'Field :field: error: :reason:.', { field: name, reason: error.message });
		}
	}

	const declared = new Set(columns.map((column) => column.name));
	const stamps = update ? ['updated', 'updated_at'] : ['created', 'created_at', 'updated', 'updated_at'];

	stamps.forEach((name) =>
	{
		if(!declared.has(name))
		{
			return;
		}

		/* a provided created stamp survives (imports, migrations); updated is always fresh */
		if((name === 'created' || name === 'created_at') && item.Get(name))
		{
			return;
		}

		fields[name] = new Date().toISOString();
	});

	return { fields, skip };
});
