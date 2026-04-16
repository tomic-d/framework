import onetype from '#framework/load.js';
import translations from '../addon.js';

onetype.MiddlewareIntercept('@database.find.execute', async (middleware) =>
{
	const { knex, query } = middleware.value;

	if(query.from)
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

	const table = query.table.name;
	const entity = query.addon.name;
	const translated = new Set(fields);

	const columns = Object.values(query.addon.Fields().data)
		.filter(field =>
		{
			if(translated.has(field.name))
			{
				return false;
			}

			const parsed = onetype.DataParseConfig(field.define);
			return !parsed.virtual;
		})
		.map(field => `m.${field.name}`)
		.join(', ');

	const pivots = fields
		.map(field => `MAX(CASE WHEN field = '${field}' THEN value END) AS ${field}`)
		.join(', ');

	const coalesce = fields
		.map(field => `COALESCE(t.${field}, m.${field}) AS ${field}`)
		.join(', ');

	const sub = query.knex.raw(`
		(SELECT ${columns}, ${coalesce}
		FROM ${table} m
		LEFT JOIN (
			SELECT entity_id, ${pivots}
			FROM database_translations
			WHERE entity = ? AND language = ?
			GROUP BY entity_id
		) t ON t.entity_id = m.id
		) AS ${table}
	`, [entity, context.language]);

	knex.from(sub);

	await middleware.next();
});
