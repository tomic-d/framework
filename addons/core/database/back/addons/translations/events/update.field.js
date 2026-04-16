import onetype from '#framework/load.js';
import translations from '../addon.js';

onetype.MiddlewareIntercept('@database.update.field', async (middleware) =>
{
	const { field, addon, language, languages } = middleware.value;
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

	if(fields.includes(field.name))
	{
		middleware.value.skip = true;
	}

	await middleware.next();
});
