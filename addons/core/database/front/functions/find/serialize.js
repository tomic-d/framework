database.Fn('find.serialize', function(query)
{
	function join(entry)
	{
		const result = {
			addon: (entry.required ? '*' : '') + entry.addon,
			field: entry.field,
			output: entry.output
		};

		if(entry.filters.length)
		{
			result.filters = entry.filters;
		}

		if(entry.select)
		{
			result.select = entry.select;
		}

		if(entry.sort)
		{
			result.sort = entry.sort;
		}

		if(entry.search)
		{
			result.search = entry.search;
		}

		if(entry.joins.length)
		{
			result.joins = entry.joins.map(join);
		}

		return result;
	}

	const state = {
		addon: query.addon,
		language: query.language,
		page: query.page,
		limit: query.limit
	};

	if(query.filters.length)
	{
		state.filters = query.filters;
	}

	if(query.search)
	{
		state.search = query.search;
	}

	if(query.sort_field)
	{
		state.sort_field = query.sort_field;
		state.sort_direction = query.sort_direction;
	}

	if(query.select)
	{
		state.select = query.select;
	}

	if(query.offset)
	{
		state.offset = query.offset;
	}

	if(query.distinct)
	{
		state.distinct = true;
	}

	if(query.version)
	{
		state.version = query.version;
	}

	if(query.joins.length)
	{
		state.joins = query.joins.map(join);
	}

	return state;
});
