pages.Fn('match', function(path)
{
	const base = onetype.Base();
	const current = path || onetype.RouteCurrent();
	const target = base && !current.startsWith(base) ? base + current : current;

	let found = null;
	let score = -1;

	for(const item of Object.values(pages.Items()))
	{
		if(!item.Get('route'))
		{
			continue;
		}

		const routes = [].concat(item.Get('route'));

		for(const route of routes)
		{
			const result = onetype.RouteMatch(route, target);

			if(!result.match)
			{
				continue;
			}

			/* Specificnija ruta pobedjuje: vise statickih segmenata, manje parametara. */
			const value = route.split('/').filter(segment => segment && !segment.startsWith(':')).length;

			if(value > score)
			{
				found = { page: item, parameters: result.params };
				score = value;
			}
		}
	}

	return found;
});
