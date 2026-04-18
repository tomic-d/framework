import onetype from '#framework/load.js';
import database from '#database/addon.js';

onetype.EmitOn('@database.find', ({ methods, query }) =>
{
	query.filters = [];
	query.impossible = false;

	const group = query._filterGroup || 'default';
	const validation = database.Fn('validation');

	const operators = [
		'EQUALS', 'NOT EQUALS', 'LESS', 'GREATER', 'LESS EQUALS', 'GREATER EQUALS',
		'LIKE', 'NOT LIKE', 'ILIKE', 'NOT ILIKE', 'IN', 'NOT IN',
		'BETWEEN', 'NOT BETWEEN', 'NULL', 'NOT NULL',
		'CONTAINS', 'CONTAINED', 'HAS'
	];

	function push(field, value, operator, type)
	{
		const normalized = operator.toUpperCase();

		if(normalized === 'NULL' || normalized === 'NOT NULL')
		{
			validation.field(field);
		}
		else if(normalized === 'BETWEEN' || normalized === 'NOT BETWEEN')
		{
			validation.field(field);
			validation.between(value);
		}
		else if(normalized === 'IN' || normalized === 'NOT IN')
		{
			validation.field(field);
			validation.operator(normalized, operators);

			if(!Array.isArray(value) || !value.length)
			{
				if(normalized === 'IN')
				{
					query.impossible = true;
				}

				return;
			}
		}
		else
		{
			validation.field(field);
			validation.operator(normalized, operators);
			validation.value(value);
		}

		query.filters.push({ field, value, operator: normalized, type, group });
	}

	methods.filter = (field, value, operator = 'EQUALS') =>
	{
		push(field, value, operator, 'AND');
		return methods;
	};

	methods.orFilter = (field, value, operator = 'EQUALS') =>
	{
		push(field, value, operator, 'OR');
		return methods;
	};

	methods.group = (type = 'AND') =>
	{
		const id = onetype.GenerateTID();
		query.filters.push({ groupStart: true, group: id, type });

		const child = { ...query, _filterGroup: id };
		child.filters = query.filters;
		child.addon = query.addon;

		return database.Fn('find.methods', child, methods);
	};
});
