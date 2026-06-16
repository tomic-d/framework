import onetype from '#framework/load.js';
import database from '#database/addon.js';
import translations from '../addon.js';

onetype.MiddlewareIntercept('@database.update', async (middleware) =>
{
	const { item, transaction, addon, language, languages } = middleware.value;
	const fields = addon.Translations();

	if(!fields)
	{
		return await middleware.next();
	}

	const context = translations.Fn('context', { language, languages });

	if(context.skip)
	{
		return await middleware.next();
	}

	const stamp = (await database.Fn('operation', transaction, 'stamp'))();

	const rows = fields
		.filter(field => item.Get(field) !== null && item.Get(field) !== undefined)
		.map(field => ({
			entity: addon.name,
			entity_id: String(item.Get('id')),
			language: context.language,
			field,
			value: String(item.Get(field)),
			updated_at: stamp
		}));

	if(rows.length)
	{
		await transaction('database_translations')
			.insert(rows)
			.onConflict(['entity', 'entity_id', 'language', 'field'])
			.merge(['value', 'updated_at']);
	}

	/* clearing a translatable field to null drops its translation row, so the read
	   falls back to the head value instead of lingering on the old translation */
	const cleared = fields.filter(field => item.Get(field) === null || item.Get(field) === undefined);

	if(cleared.length)
	{
		await transaction('database_translations')
			.where({ entity: addon.name, entity_id: String(item.Get('id')), language: context.language })
			.whereIn('field', cleared)
			.del();
	}

	await middleware.next();
});
