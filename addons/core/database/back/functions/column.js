import onetype from '#framework/load.js';
import database from '#database/addon.js';

/* Resolve a field name to its physical column. A field may live in a differently
   named column via metadata.column (slot storage); unmapped fields use their own
   name. */

database.Fn('column', function(addon, name)
{
	const field = addon.FieldGet(name);

	if(!field)
	{
		return name;
	}

	return onetype.DataParseConfig(field.define).metadata?.column || name;
});
