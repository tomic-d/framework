import filters from '../addon.js';

filters.Fn('build', function(knex, root)
{
	if(!root || !root.children || !root.children.length)
	{
		return;
	}

	const operators = {
		'EQUALS': '=',
		'NOT EQUALS': '!=',
		'LESS': '<',
		'GREATER': '>',
		'LESS EQUALS': '<=',
		'GREATER EQUALS': '>=',
		'LIKE': 'like',
		'NOT LIKE': 'not like',
		'ILIKE': 'ilike',
		'NOT ILIKE': 'not ilike',
		'IN': 'in',
		'NOT IN': 'not in'
	};

	function apply(query, filter, index)
	{
		const method = index === 0 ? 'where' : (filter.type === 'OR' ? 'orWhere' : 'where');
		const operator = filter.operator.toUpperCase();

		if(operator === 'NULL')
		{
			query[method + 'Null'](filter.field);
		}
		else if(operator === 'NOT NULL')
		{
			query[method + 'NotNull'](filter.field);
		}
		else if(operator === 'BETWEEN')
		{
			query[method + 'Between'](filter.field, filter.value);
		}
		else if(operator === 'NOT BETWEEN')
		{
			query[method + 'NotBetween'](filter.field, filter.value);
		}
		else if(operator === 'CONTAINS')
		{
			const values = Array.isArray(filter.value) ? filter.value : [filter.value];
			const cast = typeof values[0] === 'number' ? '::int[]' : '::text[]';
			query.whereRaw(`?? @> ARRAY[${values.map(() => '?').join(',')}]${cast}`, [filter.field, ...values]);
		}
		else if(operator === 'CONTAINED')
		{
			const values = Array.isArray(filter.value) ? filter.value : [filter.value];
			const cast = typeof values[0] === 'number' ? '::int[]' : '::text[]';
			query.whereRaw(`?? <@ ARRAY[${values.map(() => '?').join(',')}]${cast}`, [filter.field, ...values]);
		}
		else if(operator === 'HAS')
		{
			query.whereRaw(`?? ? ?`, [filter.field, filter.value]);
		}
		else if(operator === 'IN' || operator === 'NOT IN')
		{
			const values = Array.isArray(filter.value) ? filter.value : [filter.value];
			query[method](filter.field, operators[operator] || operator.toLowerCase(), values);
		}
		else
		{
			query[method](filter.field, operators[operator] || operator.toLowerCase(), filter.value);
		}
	}

	function walk(group, query, index)
	{
		if(!group.children.length)
		{
			return;
		}

		const method = index === 0 ? 'where' : (group.type === 'OR' ? 'orWhere' : 'where');

		query[method](function()
		{
			group.children.forEach((child, childIndex) =>
			{
				if(child.kind === 'filter')
				{
					apply(this, child, childIndex);
				}
				else
				{
					walk(child, this, childIndex);
				}
			});
		});
	}

	walk(root, knex, 0);
});
