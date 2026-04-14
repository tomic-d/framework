const OneTypeBase =
{
	Base(value)
	{
		if(typeof value !== 'undefined')
		{
			this.StateSet('base', value);

			return;
		}

		const base = this.StateGet('base', '');
		const languages = this.Languages();

		if(!languages.length)
		{
			return base;
		}

		const language = this.Language();

		if(language === languages[0])
		{
			return base;
		}

		return base + '/' + language.toLowerCase();
	}
};

export default OneTypeBase;
