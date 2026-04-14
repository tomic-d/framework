database.Fn('find', function(addon, translation)
{
	const state = {
		addon: addon.name,
		filters: [],
		search: null,
		sort_field: null,
		sort_direction: 'asc',
		page: 1,
		limit: 250,
		translation
	};

	const request = async function()
	{
		const result = await database.Fn('batch', 'find', state);

		if(result.code !== 200)
		{
			throw onetype.Error(result.code, result.message);
		}

		return result.data;
	};

	const methods = {};

	methods.filter = function(field, value, operator = 'EQUALS')
	{
		state.filters.push({ field, value, operator });
		return methods;
	};

	methods.search = function(term)
	{
		state.search = typeof term === 'string' && term.trim() ? term.trim() : null;
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
		const data = await request();
		return data.items.map(item => addon.ItemAdd(item, null, false, set));
	};

	methods.one = async function(set = false)
	{
		state.limit = 1;
		const items = await methods.many(set);
		return items.length > 0 ? items[0] : null;
	};

	methods.plain = async function()
	{
		return request();
	};

	methods.count = async function()
	{
		const data = await request();
		return data.total;
	};

	methods.exists = async function()
	{
		state.limit = 1;
		const data = await request();
		return data.total > 0;
	};

	return methods;
});
