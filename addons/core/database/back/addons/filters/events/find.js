import onetype from '#framework/load.js';
import database from '#database/addon.js';
import filters from '../addon.js';

onetype.EmitOn('@database.find', ({ methods, query }) =>
{
	query.filters = { kind: 'group', type: 'AND', children: [] };
	query.impossible = false;

	const validation = database.Fn('validation');

	function push(group, field, value, operator, type)
	{
		const normalized = operator.toUpperCase();
		const item = filters.ItemGet(normalized);

		if(!item)
		{
			throw onetype.Error(400, 'Invalid operator: :1:.', normalized);
		}

		const filter = { kind: 'filter', field, value, operator: normalized, type };
		const validate = item.Get('validate');
		const result = validate ? validate.call({}, filter, validation, query) : undefined;

		if(result === false)
		{
			return;
		}

		group.children.push(filter);
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
