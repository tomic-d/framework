import onetype from '#framework/load.js';
import joins from '../addon.js';

joins.Fn('build', async function(records, list, parent)
{
	if(!list.length || !records.length)
	{
		return records;
	}

	for(const join of list)
	{
		const addon = onetype.AddonGet(join.addon);

		if(!addon)
		{
			throw new Error(`Join addon '${join.addon}' not found.`);
		}

		const ids = [];

		records.forEach(record =>
		{
			const value = record[join.field];

			if(join.many && Array.isArray(value))
			{
				value.forEach(id =>
				{
					if(id && !ids.includes(id))
					{
						ids.push(id);
					}
				});
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

		const find = addon.Find({
			language: parent?.language || null,
			languages: parent?.languages || null
		});

		const original = find.select;

		find.select = (selected) =>
		{
			const fields = Array.isArray(selected) ? selected : [selected];

			if(!fields.includes('id'))
			{
				fields.push('id');
			}

			return original(fields);
		};

		if(join.builder)
		{
			join.builder(find);
		}

		find.filter('id', ids, 'IN').limit(ids.length);

		const joined = await find.many();
		const map = {};

		joined.forEach(item =>
		{
			map[String(item.Get('id'))] = item.data;
		});

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

		if(join.required)
		{
			records = records.filter(record =>
			{
				const value = record[join.output];

				if(join.many)
				{
					return Array.isArray(value) && value.length > 0;
				}

				return value !== null && value !== undefined;
			});
		}
	}

	return records;
});
