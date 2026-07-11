import onetype from '#framework/load.js';
import database from '#database/addon.js';

/* Column -> field name map for every field mapped via metadata.column. The read
   path uses it to hand rows back in field terms. */

database.Fn('map', function(addon)
{
	const map = {};

	for(const field of Object.values(addon.Fields().data))
	{
		const column = onetype.DataParseConfig(field.define).metadata?.column;

		if(column)
		{
			map[column] = field.name;
		}
	}

	return map;
});
