import onetype from '#framework/load.js';
import translations from '../addon.js';

onetype.MiddlewareIntercept('@database.create', async (middleware) =>
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

	const rows = fields
		.filter(field => item.Get(field) !== null && item.Get(field) !== undefined)
		.map(field => ({
			entity: addon.name,
			entity_id: String(item.Get('id')),
			language: context.language,
			field,
			value: String(item.Get(field)),
			updated_at: new Date().toISOString()
		}));

	if(rows.length)
	{
		await transaction('database_translations')
			.insert(rows)
			.onConflict(['entity', 'entity_id', 'language', 'field'])
			.merge(['value', 'updated_at']);
	}

	await middleware.next();
});
