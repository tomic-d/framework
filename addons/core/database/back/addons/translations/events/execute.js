import onetype from '#framework/load.js';
import database from '#database/addon.js';
import translations from '../addon.js';

/* Overlay translations onto the fetched rows (batched id-IN, the relations
   philosophy applied to i18n). Runs AFTER the SQL read on @database.find.transform:
   page the head table by the covering index, then fetch only that page's
   translations in one query and COALESCE in JS. Multi-db, no raw pivot/COALESCE,
   and flat as the table grows (the pivot-join did not scale). */

onetype.MiddlewareIntercept('@database.find.transform', async (middleware) =>
{
	const { records, query } = middleware.value;

	if(!records.length)
	{
		return await middleware.next();
	}

	const fields = query.addon.Translations();

	if(!fields || !fields.length)
	{
		return await middleware.next();
	}

	const context = translations.Fn('context', { language: query.language, languages: query.languages });

	if(context.skip)
	{
		return await middleware.next();
	}

	const ids = records.map((record) => record.id);

	const rows = await query.knex('database_translations')
		.where({ entity: query.addon.name, language: context.language })
		.whereIn('field', fields)
		.whereIn('entity_id', ids.map(String))
		.select('entity_id', 'field', 'value');

	const overlay = {};

	for(const row of rows)
	{
		const record = overlay[row.entity_id] || (overlay[row.entity_id] = {});
		record[row.field] = row.value;
	}

	/* translations are stored as strings; cast back to each field's declared type,
	   like the row cast does (find/execute runs before this overlay), so a numeric
	   field's translation comes back a number, not a discarded string */
	const types = {};

	for(const field of fields)
	{
		const define = query.addon.FieldGet(field)?.define;
		types[field] = define ? onetype.DataParseConfig(define).type.split('|')[0] : 'string';
	}

	for(const record of records)
	{
		const translated = overlay[String(record.id)];

		if(translated)
		{
			for(const field of fields)
			{
				if(translated[field] !== null && translated[field] !== undefined)
				{
					record[field] = database.Fn('cast.value', translated[field], types[field]);
				}
			}
		}
	}

	await middleware.next();
});
