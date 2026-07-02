import onetype from '#framework/load.js';
import database from '#database/addon.js';

/* Normalize a DB row to the addon's declared field types, so every engine
   returns the same shape (pg bigint=string, sqlite/mysql number; bool 0/1;
   json string vs object). One place, applied on every read path.
   For union types (e.g. 'number|string') the FIRST declared type is canonical. */

database.Fn('cast', function(addon, knex, record)
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
