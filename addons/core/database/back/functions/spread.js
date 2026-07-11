import onetype from '#framework/load.js';
import database from '#database/addon.js';

/* Find the addon's spread field: an object field (metadata.spread) whose column
   carries every field that has no physical column of its own. The write path
   assembles it, the read path spreads it back into the record. */

database.Fn('spread', function(addon)
{
	for(const field of Object.values(addon.Fields().data))
	{
		if(onetype.DataParseConfig(field.define).metadata?.spread)
		{
			return field.name;
		}
	}

	return null;
});
