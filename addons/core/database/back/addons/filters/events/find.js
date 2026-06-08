import onetype from '#framework/load.js';
import database from '#database/addon.js';

onetype.EmitOn('@database.find', ({ methods, query }) =>
{
	query.filters = { kind: 'group', type: 'AND', children: [] };
	query.impossible = false;

	const validation = database.Fn('validation');

	const operators = [
		'EQUALS', 'NOT EQUALS', 'LESS', 'GREATER', 'LESS EQUALS', 'GREATER EQUALS',
		'LIKE', 'NOT LIKE', 'ILIKE', 'NOT ILIKE', 'IN', 'NOT IN',
		'BETWEEN', 'NOT BETWEEN', 'NULL', 'NOT NULL',
		'CONTAINS', 'CONTAINED', 'HAS'
	];

	function push(group, field, value, operator, type)
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
		else if(normalized === 'CONTAINS' || normalized === 'CONTAINED')
		{
			validation.field(field);
			validation.operator(normalized, operators);

			if(!Array.isArray(value) || !value.length)
			{
				return;
			}
		}
		else
		{
			validation.field(field);
			validation.operator(normalized, operators);
			validation.value(value);
		}

		group.children.push({ kind: 'filter', field, value, operator: normalized, type });
	}

	function scope(group, parent)
	{
		const frame = {};

		frame.filter = (field, value, operator = 'EQUALS') =>
		{
			push(group, field, value, operator, 'AND');
			return frame;
		};

		frame.orFilter = (field, value, operator = 'EQUALS') =>
		{
			push(group, field, value, operator, 'OR');
			return frame;
		};

		frame.group = (type = 'AND') =>
		{
			const child = { kind: 'group', type, children: [] };
			group.children.push(child);
			return scope(child, frame);
		};

		frame.end = () => parent;

		return frame;
	}

	methods.filter = (field, value, operator = 'EQUALS') =>
	{
		push(query.filters, field, value, operator, 'AND');
		return methods;
	};

	methods.orFilter = (field, value, operator = 'EQUALS') =>
	{
		push(query.filters, field, value, operator, 'OR');
		return methods;
	};

	methods.group = (type = 'AND') =>
	{
		const child = { kind: 'group', type, children: [] };
		query.filters.children.push(child);
		return scope(child, methods);
	};
});
