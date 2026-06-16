import versions from '../addon.js';

/* Evaluate a filter tree against one record in JS — used for version time-travel
   reads where rows are reconstructed in memory, not queried. Mirrors the SQL
   filter operators so historical filtering matches live filtering. */

/* Translate a SQL LIKE pattern to an anchored regex: '%' is any run, '_' is any
   single char, everything else is literal. Anchored so 'abc%' is a prefix and
   'abc' (no wildcard) is an exact match, matching SQL LIKE, not substring. */
function pattern(value, flags)
{
	const escaped = String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const body = escaped.replace(/%/g, '.*').replace(/_/g, '.');

	return new RegExp('^' + body + '$', flags);
}

const operators = {
	'EQUALS': (a, b) => a == b,
	'NOT EQUALS': (a, b) => a != b,
	'LESS': (a, b) => a < b,
	'GREATER': (a, b) => a > b,
	'LESS EQUALS': (a, b) => a <= b,
	'GREATER EQUALS': (a, b) => a >= b,
	'LIKE': (a, b) => pattern(b, '').test(String(a)),
	'NOT LIKE': (a, b) => !pattern(b, '').test(String(a)),
	'ILIKE': (a, b) => pattern(b, 'i').test(String(a)),
	'NOT ILIKE': (a, b) => !pattern(b, 'i').test(String(a)),
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

versions.Fn('match', function(record, node)
{
	if(node.kind === 'group')
	{
		if(!node.children.length)
		{
			return true;
		}

		if(node.type === 'OR')
		{
			return node.children.some((child) => versions.Fn('match', record, child));
		}

		return node.children.every((child) => versions.Fn('match', record, child));
	}

	const operator = operators[node.operator] || operators['EQUALS'];

	return operator(record[node.field], node.value);
});
