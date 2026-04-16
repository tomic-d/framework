import onetype from '#framework/load.js';

onetype.MiddlewareIntercept('@database.find.execute', async (middleware) =>
{
	const { knex, query } = middleware.value;
	const config = query.addon.Versions();

	if(!config)
	{
		return await middleware.next();
	}

	if(query.versionId)
	{
		const table = query.table.name;
		const entity = query.addon.name;

		const fields = Object.values(query.addon.Fields().data)
			.filter(field =>
			{
				const parsed = onetype.DataParseConfig(field.define);
				return !parsed.virtual;
			})
			.map(field =>
			{
				const parsed = onetype.DataParseConfig(field.define);

				if(field.name === 'id')
				{
					return 'entity_id AS id';
				}

				const cast = parsed.type === 'number' ? '::bigint' :
				             parsed.type === 'boolean' ? '::boolean' :
				             parsed.type === 'object' || parsed.type === 'array' ? '::jsonb' :
				             field.name.endsWith('_at') ? '::timestamptz' :
				             '::text';

				return `MAX(CASE WHEN field = '${field.name}' THEN value END)${cast} AS ${field.name}`;
			})
			.join(', ');

		const sub = query.knex.raw(`
			(SELECT ${fields}
			FROM (
				SELECT DISTINCT ON (entity_id, field)
					entity_id, field,
					(changes->field->>'new') as value
				FROM database_versions,
				     LATERAL jsonb_object_keys(changes) as field
				WHERE addon = ? AND language IS NULL AND id <= ?
				ORDER BY entity_id, field, id DESC
			) latest
			WHERE EXISTS (
				SELECT 1 FROM database_versions v
				WHERE v.addon = ? AND v.entity_id = latest.entity_id
				  AND v.operation = 'create' AND v.id <= ?
			)
			GROUP BY entity_id
			) AS ${table}
		`, [entity, query.versionId, entity, query.versionId]);

		knex.from(sub);
	}

	if(!query.versionId)
	{
		knex.whereNull(config.delete);
	}

	await middleware.next();
});
