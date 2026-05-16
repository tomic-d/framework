database.Fn('find', function(addon, language)
{
	const query = {
		addon: addon.name,
		language,
		filters: [],
		joins: [],
		search: null,
		sort_field: null,
		sort_direction: 'asc',
		page: 1,
		limit: 250,
		offset: null,
		select: null,
		distinct: false,
		version: null
	};

	async function request()
	{
		const state = database.Fn('find.serialize', query);
		const result = await database.Fn('batch', 'find', state);

		if(result.code !== 200)
		{
			throw onetype.Error(result.code, result.message);
		}

		return result.data;
	}

	const methods = {};

	methods.filter = (field, value, operator = 'EQUALS') =>
	{
		query.filters.push({ field, value, operator });
		return methods;
	};

	methods.orFilter = (field, value, operator = 'EQUALS') =>
	{
		query.filters.push({ field, value, operator, type: 'OR' });
		return methods;
	};

	methods.search = (term) =>
	{
		query.search = typeof term === 'string' && term.trim() ? term.trim() : null;
		return methods;
	};

	methods.sort = (field, direction = 'asc') =>
	{
		query.sort_field = field;
		query.sort_direction = direction;
		return methods;
	};

	methods.page = (page) =>
	{
		query.page = page;
		return methods;
	};

	methods.limit = (limit) =>
	{
		query.limit = limit;
		return methods;
	};

	methods.offset = (offset) =>
	{
		query.offset = offset;
		return methods;
	};

	methods.select = (fields) =>
	{
		query.select = Array.isArray(fields) ? fields : [fields];
		return methods;
	};

	methods.distinct = (value = true) =>
	{
		query.distinct = Boolean(value);
		return methods;
	};

	methods.version = (id) =>
	{
		query.version = id;
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

		query.joins.push(child.state);

		return methods;
	};

	methods.many = async (set = false) =>
	{
		const data = await request();

		for(const join of query.joins)
		{
			if(!addon.FieldGet(join.output))
			{
				addon.Field(join.output, { type: 'object', virtual: true });
			}
		}

		return data.items.map(item => addon.ItemAdd(item, null, false, set));
	};

	methods.one = async (set = false) =>
	{
		query.limit = 1;
		const items = await methods.many(set);
		return items.length > 0 ? items[0] : null;
	};

	methods.plain = async () =>
	{
		return request();
	};

	methods.count = async () =>
	{
		const data = await request();
		return data.total;
	};

	methods.exists = async () =>
	{
		query.limit = 1;
		const data = await request();
		return data.total > 0;
	};

	methods.sum = async (field) =>
	{
		const state = database.Fn('find.serialize', query);
		state.aggregate = { type: 'sum', field };
		const result = await database.Fn('batch', 'find', state);

		if(result.code !== 200)
		{
			throw onetype.Error(result.code, result.message);
		}

		return result.data.value;
	};

	methods.avg = async (field) =>
	{
		const state = database.Fn('find.serialize', query);
		state.aggregate = { type: 'avg', field };
		const result = await database.Fn('batch', 'find', state);

		if(result.code !== 200)
		{
			throw onetype.Error(result.code, result.message);
		}

		return result.data.value;
	};

	methods.min = async (field) =>
	{
		const state = database.Fn('find.serialize', query);
		state.aggregate = { type: 'min', field };
		const result = await database.Fn('batch', 'find', state);

		if(result.code !== 200)
		{
			throw onetype.Error(result.code, result.message);
		}

		return result.data.value;
	};

	methods.max = async (field) =>
	{
		const state = database.Fn('find.serialize', query);
		state.aggregate = { type: 'max', field };
		const result = await database.Fn('batch', 'find', state);

		if(result.code !== 200)
		{
			throw onetype.Error(result.code, result.message);
		}

		return result.data.value;
	};

	methods.metrics = async (field, interval, aggregate, value) =>
	{
		const state = database.Fn('find.serialize', query);
		state.metrics = { field, interval, aggregate, value };
		const result = await database.Fn('batch', 'find', state);

		if(result.code !== 200)
		{
			throw onetype.Error(result.code, result.message);
		}

		return result.data.data;
	};

	return methods;
});
