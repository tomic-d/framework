breadcrumb.Fn('get', function()
{
	return Object.values(breadcrumb.Items())
		.filter(item =>
		{
			if (item.Get('condition') === false)
			{
				return false;
			}

			return true;
		})
		.sort((a, b) => a.Get('order') - b.Get('order'))
		.map(item =>
		({
			id: item.Get('id'),
			order: item.Get('order'),
			icon: item.Get('icon'),
			label: item.Get('label'),
			href: item.Get('href')
		}));
});
