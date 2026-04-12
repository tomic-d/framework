elements.Fn('type.format.currency', function(value, currency)
{
	if(value === null || value === undefined || value === '')
	{
		return '—';
	}

	const symbol = currency || '€';

	if(typeof value !== 'number')
	{
		return symbol + value;
	}

	return symbol + value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
});
