const OneTypeLanguage =
{
	Language(value)
	{
		if(typeof value === 'undefined')
		{
			return this.LanguageGet();
		}

		this.LanguageSet(value);
	},

	LanguageGet()
	{
		return this.StateGet('language', 'EN');
	},

	LanguageSet(value)
	{
		this.LanguageValidate(value);
		this.StateSet('language', value);
	},

	Languages(value)
	{
		if(typeof value === 'undefined')
		{
			return this.LanguagesGet();
		}

		this.LanguagesSet(value);
	},

	LanguagesGet()
	{
		return this.StateGet('languages', []);
	},

	LanguagesSet(value)
	{
		this.StateSet('languages', value);
	},

	LanguageValidate(code)
	{
		if(typeof code !== 'string' || !/^[A-Z]{2}$/.test(code))
		{
			throw this.Error(400, 'Language must be a 2-letter uppercase code, received: :code:.', {code});
		}

		return code;
	}
};

export default OneTypeLanguage;
