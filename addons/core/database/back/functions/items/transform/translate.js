import database from '#database/addon.js';

database.Fn('items.transform.translate', async function(records, query)
{
	const translations = query.addon.database.translations;

	if(!translations || !records.length)
	{
		return records;
	}

	const ids = records.map(record => String(record.id)).filter(Boolean);

	if(!ids.length)
	{
		return records;
	}

	const rows = await query.knex('translations')
		.where({entity: query.addon.name, language: query.translation})
		.whereIn('entity_id', ids);

	if(!rows.length)
	{
		return records;
	}

	const map = {};

	rows.forEach(row =>
	{
		if(!map[row.entity_id])
		{
			map[row.entity_id] = {};
		}

		map[row.entity_id][row.field] = row.value;
	});

	records.forEach(record =>
	{
		const translated = map[String(record.id)];

		if(translated)
		{
			for(const field of translations)
			{
				if(translated[field] !== undefined)
				{
					record[field] = translated[field];
				}
			}
		}
	});

	return records;
});
