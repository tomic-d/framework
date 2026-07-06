pages.Fn('change', async function(id, path = null, parameters = {}, push = true, search = '')
{
	this.methods.route = (page, values) =>
	{
		const route = page.Get('route');

		if(!Array.isArray(route))
		{
			return route;
		}

		return route.findLast(pattern => (pattern.match(/:(\w+)/g) || []).every(param => Object.keys(values).includes(param.slice(1)))) || route[0];
	};

	const resolved = this.Fn('resolve', id, path, parameters);

	if(!resolved)
	{
		return null;
	}

	if(push !== false)
	{
		const target = path
			? onetype.RouteNormalize(path)
			: onetype.RouteBuild(this.methods.route(resolved.page, resolved.parameters), resolved.parameters);

		history.pushState(null, '', target + search);
	}

	const result = await this.Fn('open', resolved.id, resolved.parameters);

	return result === false ? null : resolved.page;
});
