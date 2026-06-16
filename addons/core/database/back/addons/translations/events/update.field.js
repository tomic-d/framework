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

	/* Writing a non-default language must not touch the head table at all:
	   translatable fields go to database_translations, and non-translatable
	   fields keep their default-language value (the edit carries only the
	   translation, not real values for shared columns). Skip every field. */
	middleware.value.skip = true;

	await middleware.next();
});
