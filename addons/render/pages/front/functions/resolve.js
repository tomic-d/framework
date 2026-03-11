pages.Fn('resolve', function(id, path = null, parameters = {})
{
	if(path)
	{
		const match = this.Fn('match', path);

		if(match)
		{
			return { page: match.page, id: match.page.Get('id'), parameters: { ...match.parameters, ...parameters } };
		}
	}
	else if(id)
	{
		const page = this.ItemGet(id);

		if(page)
		{
			return { page, id, parameters };
		}
	}

	const page = Object.values(this.Items()).find(p => p.Get('404'));

	if(page)
	{
		return { page, id: page.Get('id'), parameters };
	}

	return null;
});
