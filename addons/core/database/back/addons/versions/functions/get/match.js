import versions from '#database/addons/versions/addon.js';

versions.Fn('get.match', function(record, node)
{
	this.methods.pattern = (value, flags) =>
	{
		const escaped = String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const body = escaped.replace(/%/g, '.*').replace(/_/g, '.');

		return new RegExp('^' + body + '$', flags);
	};

	this.methods.operators = {
		'EQUALS': (a, b) => a == b,
		'NOT EQUALS': (a, b) => a != b,
		'LESS': (a, b) => a < b,
		'GREATER': (a, b) => a > b,
		'LESS EQUALS': (a, b) => a <= b,
		'GREATER EQUALS': (a, b) => a >= b,
		'LIKE': (a, b) => this.methods.pattern(b, '').test(String(a)),
		'NOT LIKE': (a, b) => !this.methods.pattern(b, '').test(String(a)),
		'ILIKE': (a, b) => this.methods.pattern(b, 'i').test(String(a)),
		'NOT ILIKE': (a, b) => !this.methods.pattern(b, 'i').test(String(a)),
		'IN': (a, b) => Array.isArray(b) && b.includes(a),
		'NOT IN': (a, b) => Array.isArray(b) && !b.includes(a),
		'BETWEEN': (a, b) => Array.isArray(b) && a >= b[0] && a <= b[1],
		'NOT BETWEEN': (a, b) => Array.isArray(b) && (a < b[0] || a > b[1]),
		'NULL': (a) => a === null || a === undefined,
		'NOT NULL': (a) => a !== null && a !== undefined,
		'CONTAINS': (a, b) => Array.isArray(a) && (Array.isArray(b) ? b : [b]).every((value) => a.includes(value)),
		'OVERLAP': (a, b) => Array.isArray(a) && (Array.isArray(b) ? b : [b]).some((value) => a.includes(value)),
		'HAS': (a, b) => Array.isArray(a) && a.includes(b)
	};

	if(node.kind === 'group')
	{
		if(!node.children.length)
		{
			return true;
		}

		if(node.type === 'OR')
		{
			return node.children.some((child) => versions.Fn('get.match', record, child));
		}

		return node.children.every((child) => versions.Fn('get.match', record, child));
	}

	const operator = this.methods.operators[node.operator] || this.methods.operators['EQUALS'];

	return operator(record[node.field], node.value);
});
