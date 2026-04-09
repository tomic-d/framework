const OneTypeLanguage =
{
	Language(value)
	{
		if(typeof value === 'undefined')
		{
			return this.StateGet('language', 'en');
		}

		this.LanguageValidate(value);
		this.StateSet('language', value);
	},

	LanguageValidate(code)
	{
		if(typeof code !== 'string' || !/^[a-z]{2}$/.test(code))
		{
			throw this.Error(400, 'Language must be a 2-letter lowercase code, received: :code:.', {code});
		}

		return code;
	}
};

export default OneTypeLanguage;
