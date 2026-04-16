database.Fn('find.join', function(config)
{
	const state = {
		addon: config.addon,
		field: config.field,
		output: config.output,
		required: config.required,
		filters: [],
		joins: [],
		select: null,
		sort: null,
		search: null
	};

	const methods = {};

	methods.filter = (field, value, operator = 'EQUALS') =>
	{
		state.filters.push({ field, value, operator });
		return methods;
	};

	methods.orFilter = (field, value, operator = 'EQUALS') =>
	{
		state.filters.push({ field, value, operator, type: 'OR' });
		return methods;
	};

	methods.select = (fields) =>
	{
		state.select = Array.isArray(fields) ? fields : [fields];
		return methods;
	};

	methods.sort = (field, direction = 'asc') =>
	{
		state.sort = { field, direction };
		return methods;
	};

	methods.search = (term) =>
	{
		state.search = typeof term === 'string' && term.trim() ? term.trim() : null;
		return methods;
	};

	methods.join = (addon, field, output = null, builder = null) =>
	{
		let required = false;

		if(addon.startsWith('*'))
		{
			required = true;
			addon = addon.slice(1);
		}

		const child = database.Fn('find.join', {
			addon,
			field,
			output: output || field,
			required
		});

		if(builder)
		{
			builder(child.methods);
		}

		state.joins.push(child.state);

		return methods;
	};

	return { methods, state };
});
