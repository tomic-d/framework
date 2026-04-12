elements.Fn('type.format.number', function(value)
{
	if(value === null || value === undefined || value === '')
	{
		return '—';
	}

	if(typeof value !== 'number')
	{
		return String(value);
	}

	if(Math.abs(value) >= 1000000)
	{
		return (value / 1000000).toFixed(1) + 'M';
	}

	if(Math.abs(value) >= 1000)
	{
		return (value / 1000).toFixed(1) + 'k';
	}

	return String(value);
});
