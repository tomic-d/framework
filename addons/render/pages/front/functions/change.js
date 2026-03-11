pages.Fn('change', async function(id, path = null, parameters = {}, push = true, search = '')
{
	this.methods.route = (page) =>
	{
		const route = page.Get('route');

		if(!Array.isArray(route))
		{
			return route;
		}

		return route.findLast(pattern => (pattern.match(/:(\w+)/g) || []).every(param => Object.keys(parameters).includes(param.slice(1)))) || route[0];
	};

	const resolved = this.Fn('resolve', id, path, parameters);

	if(!resolved)
	{
		return null;
	}

	if(push !== false)
	{
		history.pushState(null, '', onetype.RouteBuild(this.methods.route(resolved.page), resolved.parameters) + search);
	}

	const result = await this.Fn('open', resolved.id, resolved.parameters);

	return result === false ? null : resolved.page;
});
