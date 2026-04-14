pages.Fn('match', function(path)
{
	const base = onetype.Base();
	const current = path || onetype.RouteCurrent();
	const target = base && !current.startsWith(base) ? base + current : current;

	for(const item of Object.values(pages.Items()))
	{
		if(item.Get('404') || !item.Get('route'))
		{
			continue;
		}

		const routes = [].concat(item.Get('route'));

		for(const route of routes)
		{
			const result = onetype.RouteMatch(route, target);

			if(result.match)
			{
				return {
					page: item,
					parameters: result.params
				};
			}
		}
	}

	return null;
});
