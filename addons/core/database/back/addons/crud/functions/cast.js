import onetype from '#framework/load.js';
import database from '#database/addon.js';

database.Fn('cast', function(addon, record)
{
	const map = database.Fn('map', addon);
	const spread = database.Fn('spread', addon);
	const data = {};

	Object.entries(record).forEach(([key, value]) =>
	{
		const name = map[key] || key;
		const field = addon.FieldGet(name);

		if(!field)
		{
			/* a spread addon has a closed field world: columns no field claims
			   (empty slots) are storage, not data */
			if(!spread)
			{
				data[name] = value instanceof Date ? value.toISOString() : value;
			}

			return;
		}

		const parsed = onetype.DataParseConfig(field.define);

		data[name] = database.Fn('cast.value', value, parsed.type.split('|')[0]);
	});

	if(spread && data[spread] && typeof data[spread] === 'object')
	{
		for(const [key, value] of Object.entries(data[spread]))
		{
			if(!(key in data))
			{
				data[key] = value;
			}
		}

		delete data[spread];
	}

	return data;
});
