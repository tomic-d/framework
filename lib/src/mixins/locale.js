const OneTypeLocale =
{
	LocaleGet(text, key = null)
	{
		const language = this.Language();
		const hash = this.GenerateHash(key ? key + ':' + text : text);
		const locales = this.LocalesGet(language);

		if(hash in locales)
		{
			return locales[hash];
		}

		this.LocaleSet(text, key);

		return text;
	},

	LocaleSet(text, key = null)
	{
		const language = this.Language();
		const hash = this.GenerateHash(key ? key + ':' + text : text);
		const locales = this.LocalesGet(language);

		locales[hash] = text;
		this.LocalesSet(language, locales);
	},

	LocalesGet(language)
	{
		const locales = this.StateGet('locales', {});

		if(language in locales)
		{
			return locales[language]
		}

		return {};
	},

	LocalesSet(language, values)
	{
		const locales = this.StateGet('locales', {});
		locales[language] = values;
		this.StateSet('locales', locales);
	}
};

export default OneTypeLocale;
