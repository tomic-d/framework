items.Fn('get', function(group, options = {})
{
	const {
		order = true,
		data = true,
		condition = true
	} = options;

	let result = Object.values(this.Items()).filter(item => item.Get('group') === group);

	// Apply condition filter if enabled
	if(condition)
	{
		result = result.filter(item =>
		{
			const cond = item.Get('condition');
			return !cond || cond(item);
		});
	}

	// Sort by order if enabled
	if(order)
	{
		result = result.sort((a, b) => a.Get('order') - b.Get('order'));
	}

	// Return only data if enabled, otherwise return items
	if(data)
	{
		result = result.map(item => item.Get('data'));
	}

	return result;
});
