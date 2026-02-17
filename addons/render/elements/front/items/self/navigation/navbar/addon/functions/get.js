navbar.Fn('get', function(position = null)
{
	return Object.values(navbar.Items())
		.filter(item =>
		{
			if (item.Get('condition') === false)
			{
				return false;
			}

			if (position && item.Get('position') !== position)
			{
				return false;
			}

			return true;
		})
		.sort((a, b) => a.Get('order') - b.Get('order'))
		.map(item =>
		({
			id: item.Get('id'),
			position: item.Get('position'),
			order: item.Get('order'),
			icon: item.Get('icon'),
			label: item.Get('label'),
			href: item.Get('href'),
			variant: item.Get('variant'),
			size: item.Get('size'),
			active: item.Get('active')
		}));
});
