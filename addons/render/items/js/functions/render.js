items.Fn('renderGroup', function(group, options = {})
{
	const {
		order = true,
		condition = true,
		wrapper = null
	} = options;

	let result = Object.values(this.Items())
		.filter(item => item.Get('group') === group && item.Get('render'));

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

	// Render all items
	const rendered = result.map(item =>
	{
		const render = this.Render(item.Get('id'));
		return render ? render.Element : null;
	}).filter(el => el !== null);

	// Wrap in container if specified
	if(wrapper)
	{
		const container = document.createElement(wrapper);
		rendered.forEach(el => container.appendChild(el));
		return container;
	}

	return rendered;
});
