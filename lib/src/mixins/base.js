const OneTypeBase =
{
	Base(value)
	{
		if(typeof value === 'undefined')
		{
			return this.StateGet('base', '');
		}

		this.StateSet('base', value);
	}
};

export default OneTypeBase;
