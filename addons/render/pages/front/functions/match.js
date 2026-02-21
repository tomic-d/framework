pages.Fn('match', function(path)
{
	const items = Object.values(pages.Items());

	for(const item of items)
	{
		// Skip 404 pages during normal matching
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

		for(const r of routes)
		{
			const result = divhunt.RouteMatch(r, path || divhunt.RouteCurrent());

			if(result.match)
			{
				return { page: item, parameters: result.params };
			}
		}
	}

	return null;
});
