import onetype from '#framework/load.js';
import database from '#database/addon.js';

/* Turn an addon's field definitions into column descriptors for DDL. Scalars
   become real columns; virtual fields are skipped. A column is bounded (varchar
   instead of text) when it takes part in any key (index or unique), since mysql
   rejects a key on unbounded TEXT. The primary field is flagged so sync.column
   makes it the PK (auto-increment when numeric, plain otherwise). */

database.Fn('sync.columns', function(addon)
{
	const columns = [];
	const primary = addon.Primary();
	const keyed = new Set([...addon.Index().flat(), ...addon.Unique().flat()]);

	Object.values(addon.Fields().data).forEach((field) =>
	{
		const parsed = onetype.DataParseConfig(field.define);

		if(parsed.virtual)
		{
			return;
		}

		columns.push({
			name: field.name,
			type: parsed.type,
			value: parsed.value,
			required: parsed.required === true,
			primary: field.name === primary.field,
			auto: field.name === primary.field && primary.auto,
			bounded: keyed.has(field.name)
		});
	});

	return columns;
});
