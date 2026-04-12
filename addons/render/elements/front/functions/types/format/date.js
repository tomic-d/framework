elements.Fn('type.format.date', function(value)
{
	if(!value)
	{
		return '—';
	}

	const date = new Date(value);

	if(isNaN(date))
	{
		return '—';
	}

	return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
});
