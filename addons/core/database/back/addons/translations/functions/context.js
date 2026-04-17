import onetype from '#framework/load.js';
import translations from '../addon.js';

translations.Fn('context', function({ language, languages } = {})
{
	const pattern = /^[A-Z]{2}$/;

	if(language !== null && language !== undefined)
	{
		if(!pattern.test(language))
		{
			throw onetype.Error(400, 'Invalid language code :1:.', language);
		}
	}

	if(Array.isArray(languages))
	{
		for(const code of languages)
		{
			if(!pattern.test(code))
			{
				throw onetype.Error(400, 'Invalid language code :1:.', code);
			}
		}
	}

	const context = {
		language: language || null,
		languages: Array.isArray(languages) && languages.length ? languages : null,
		default: false,
		skip: true
	};

	if(!context.language || !context.languages)
	{
		return context;
	}

	context.default = context.language === context.languages[0];
	context.skip = context.default;

	return context;
});
