import onetype from '#framework/load.js';
import database from '#database/addon.js';
import crud from '#database/addons/crud/addon.js';

/* Collect every non-virtual field that has no physical column into one object —
   the value the spread column stores. */

crud.Fn('fields.bag', function(item, columns)
{
	const declared = new Set(columns.map((column) => column.name));
	const bag = {};

	for(const field of Object.values(item.addon.Fields().data))
	{
		const parsed = onetype.DataParseConfig(field.define);

		if(parsed.virtual || parsed.metadata?.spread)
		{
			continue;
		}

		if(declared.has(database.Fn('column', item.addon, field.name)))
		{
			continue;
		}

		bag[field.name] = item.Get(field.name);
	}

	return bag;
});
