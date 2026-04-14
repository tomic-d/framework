import onetype from '#framework/load.js';
import database from '#database/addon.js';

database.Fn('items.methods', function(query, context = null, groupId = 'default')
{
	const validation = database.Fn('items.validation');
	const methods = {};

	methods.limit = limit =>
	{
		validation.limit(limit);
		query.limit = limit;
		return methods;
	};

	methods.page = page =>
	{
		validation.page(page);
		query.page = page;
		return methods;
	};

	methods.sort = (field, direction = 'asc') =>
	{
		validation.field(field);
		direction = validation.direction(direction);

		query.sort = { field, direction };
		return methods;
	};

	methods.select = fields =>
	{
		fields = Array.isArray(fields) ? fields : [fields];
		validation.fields(fields);

		query.select = fields;
		return methods;
	};

	methods.search = term =>
	{
		query.search = typeof term === 'string' && term.trim() ? term.trim() : null;
		return methods;
	};

	methods.distinct = (value = true) =>
	{
		query.distinct = Boolean(value);
		return methods;
	};

	methods.filter = (field, value, operator = 'EQUALS') =>
	{
		return database.Fn('items.filter', query, field, value, operator, 'AND', groupId, methods);
	};

	methods.orFilter = (field, value, operator = 'EQUALS') =>
	{
		return database.Fn('items.filter', query, field, value, operator, 'OR', groupId, methods);
	};

	methods.group = (type = 'AND') =>
	{
		const TID = onetype.GenerateTID();

		if(!query.filters)
		{
			query.filters = [];
		}

		query.filters.push({ groupStart: true, group: TID, type });

		const groupMethods = database.Fn('items.methods', query, methods, TID);
		groupMethods.end = () => context || methods;

		return groupMethods;
	};

	methods.join = (addon, field, output = null) =>
	{
		const config = query.addon.FieldGet(field);

		if(!config)
		{
			throw new Error(`Field '${field}' not found in addon`);
		}

		const parsed = onetype.DataParseConfig(config.define);
		const many = parsed.type.includes('array');

		query.joins.push({ addon, field, output: output || field, many });

		return methods;
	};

	methods.many = async (set = false) =>
	{
		return database.Fn('items.methods.many', query, set);
	};

	methods.plain = async () =>
	{
		return database.Fn('items.methods.plain', query);
	};

	methods.count = async () =>
	{
		return database.Fn('items.methods.count', query);
	};

	methods.one = async (set = false) =>
	{
		return database.Fn('items.methods.one', query, set);
	};

	methods.exists = async () =>
	{
		return database.Fn('items.methods.exists', query);
	};

	methods.sum = async (field) =>
	{
		return database.Fn('items.methods.aggregate', query, 'sum', field);
	};

	methods.avg = async (field) =>
	{
		return database.Fn('items.methods.aggregate', query, 'avg', field);
	};

	methods.min = async (field) =>
	{
		return database.Fn('items.methods.aggregate', query, 'min', field);
	};

	methods.max = async (field) =>
	{
		return database.Fn('items.methods.aggregate', query, 'max', field);
	};

	if(context)
	{
		methods.end = () => context;
	}

	return methods;
});
