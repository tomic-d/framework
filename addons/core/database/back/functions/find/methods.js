import onetype from '#framework/load.js';
import database from '#database/addon.js';

database.Fn('find.methods', function(query, context = null)
{
	const validation = database.Fn('validation');
	const methods = {};

	methods.limit = (limit) =>
	{
		validation.limit(limit);
		query.limit = limit;
		return methods;
	};

	methods.page = (page) =>
	{
		validation.page(page);
		query.page = page;
		return methods;
	};

	methods.offset = (offset) =>
	{
		query.offset = offset;
		return methods;
	};

	methods.sort = (field, direction = 'asc') =>
	{
		validation.field(field);
		query.sort = { field, direction: validation.direction(direction) };
		return methods;
	};

	methods.select = (fields) =>
	{
		fields = Array.isArray(fields) ? fields : [fields];
		validation.fields(fields);
		query.select = fields;
		return methods;
	};

	methods.distinct = (value = true) =>
	{
		query.distinct = Boolean(value);
		return methods;
	};

	methods.many = async (set = false) =>
	{
		return database.Fn('find.many', query, set);
	};

	methods.one = async (set = false) =>
	{
		return database.Fn('find.one', query, set);
	};

	methods.plain = async () =>
	{
		return database.Fn('find.plain', query);
	};

	methods.count = async () =>
	{
		return database.Fn('find.count', query);
	};

	methods.exists = async () =>
	{
		return database.Fn('find.exists', query);
	};

	methods.sum = async (field) =>
	{
		return database.Fn('find.aggregate', query, 'sum', field);
	};

	methods.avg = async (field) =>
	{
		return database.Fn('find.aggregate', query, 'avg', field);
	};

	methods.min = async (field) =>
	{
		return database.Fn('find.aggregate', query, 'min', field);
	};

	methods.max = async (field) =>
	{
		return database.Fn('find.aggregate', query, 'max', field);
	};

	if(context)
	{
		methods.end = () => context;
	}

	onetype.Emit('@database.find', { methods, query, addon: query.addon });

	return methods;
});
