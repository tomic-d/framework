sidebar.Fn('get', function(filter = {})
{
	return Object.values(sidebar.Items())
		.filter(item =>
		{
			if (item.Get('condition') === false)
			{
				return false;
			}

			if (filter.type && item.Get('type') !== filter.type)
			{
				return false;
			}

			if (filter.group && item.Get('group') !== filter.group)
			{
				return false;
			}

			return true;
		})
		.sort((a, b) => a.Get('order') - b.Get('order'))
		.map(item =>
		({
			id: item.Get('id'),
			type: item.Get('type'),
			group: item.Get('group'),
			order: item.Get('order'),
			icon: item.Get('icon'),
			label: item.Get('label'),
			href: item.Get('href'),
			active: item.Get('active')
		}));
});
