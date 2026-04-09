import onetype from '#framework/load.js';
import database from '#database/addon.js';

database.Fn('items.transform.join', async function(records, joins)
{
	if(!joins.length || !records.length)
	{
		return records;
	}

	for(const join of joins)
	{
		const addon = onetype.AddonGet(join.addon);

		if(!addon)
		{
			throw new Error(`Join addon '${join.addon}' not found`);
		}

		const ids = [];

		records.forEach(record =>
		{
			const value = record[join.field];

			if(join.many && Array.isArray(value))
			{
				value.forEach(id => { if(id && !ids.includes(id)) ids.push(id); });
			}
			else if(value && !ids.includes(value))
			{
				ids.push(value);
			}
		});

		if(!ids.length)
		{
			continue;
		}

		const joined = await addon.Find().filter('id', ids, 'IN').limit(ids.length).many();
		const map = {};

		const fields = Object.keys(addon.Fields().data);
		joined.forEach(item => { map[String(item.Get('id'))] = item.Get(fields); });

		records.forEach(record =>
		{
			const value = record[join.field];

			if(join.many && Array.isArray(value))
			{
				record[join.output] = value.map(id => map[String(id)]).filter(Boolean);
			}
			else if(value)
			{
				record[join.output] = map[String(value)] || null;
			}
		});
	}

	return records;
});
