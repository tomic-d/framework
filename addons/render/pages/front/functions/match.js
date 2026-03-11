pages.Fn('match', function(path)
{
	const items = Object.values(pages.Items());

	for(const item of items)
	{
		if(item.Get('404'))
		{
			continue;
		}

		const route = item.Get('route');

		if(!route)
		{
			continue;
		}

		const routes = Array.isArray(route) ? route : [route];

		for(const part of routes)
		{
			const result = onetype.RouteMatch(part, path || onetype.RouteCurrent());

			if(result.match)
			{
				return { page: item, parameters: result.params };
			}
		}
	}

	return null;
});
