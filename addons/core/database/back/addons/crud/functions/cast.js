import onetype from '#framework/load.js';
import database from '#database/addon.js';

database.Fn('cast', function(addon, record)
{
	const data = {};

	Object.entries(record).forEach(([key, value]) =>
	{
		const field = addon.FieldGet(key);

		if(!field)
		{
			data[key] = value instanceof Date ? value.toISOString() : value;
			return;
		}

		const parsed = onetype.DataParseConfig(field.define);

		data[key] = database.Fn('cast.value', value, parsed.type.split('|')[0]);
	});

	return data;
});
