database.Fn('find', function(addon)
{
	const state = {
		addon: addon.GetName(),
		filters: [],
		joins: [],
		sort_field: null,
		sort_direction: 'asc',
		page: 1,
		limit: 50
	};

	const methods = {};

	methods.filter = function(field, value, operator = 'EQUALS')
	{
		state.filters.push({ field, value, operator });
		return methods;
	};

	methods.join = function(addon, field, output, select)
	{
		const join = { addon, field, output: output || field };

		if(select)
		{
			join.select = Array.isArray(select) ? select : [select];
		}

		state.joins.push(join);
		return methods;
	};

	methods.sort = function(field, direction = 'asc')
	{
		state.sort_field = field;
		state.sort_direction = direction;
		return methods;
	};

	methods.page = function(page)
	{
		state.page = page;
		return methods;
	};

	methods.limit = function(limit)
	{
		state.limit = limit;
		return methods;
	};

	methods.select = function(fields)
	{
		state.select = Array.isArray(fields) ? fields : [fields];
		return methods;
	};

	methods.many = async function(set = false)
	{
		const response = await fetch('/api/database', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(state)
		});

		const result = await response.json();

		if(result.code !== 200)
		{
			throw new Error(result.message);
		}

		const items = result.data.items.map(function(data)
		{
			return addon.ItemAdd(data, null, false, set);
		});

		return items;
	};

	methods.one = async function(set = false)
	{
		state.limit = 1;

		const items = await methods.many(set);

		return items.length > 0 ? items[0] : null;
	};

	methods.plain = async function()
	{
		const response = await fetch('/api/database', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(state)
		});

		const result = await response.json();

		if(result.code !== 200)
		{
			throw new Error(result.message);
		}

		const total = result.data.total || 0;

		return {
			items: result.data.items,
			total,
			page: result.data.page || state.page,
			pages: state.limit > 0 ? Math.ceil(total / state.limit) : 1,
			limit: result.data.limit || state.limit
		};
	};

	methods.count = async function()
	{
		const response = await fetch('/api/database', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(state)
		});

		const result = await response.json();

		if(result.code !== 200)
		{
			throw new Error(result.message);
		}

		return result.data.total;
	};

	return methods;
});
