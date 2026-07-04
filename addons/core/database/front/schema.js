onetype.DataSchema('database.filter', {
	field: {
		type: 'string',
		required: true,
		description: 'Column the filter applies to.'
	},
	value: {
		type: 'string|number|boolean|array',
		description: 'Value to compare against. Arrays for IN, BETWEEN, CONTAINS and OVERLAP.'
	},
	operator: {
		type: 'string',
		value: 'EQUALS',
		options: ['EQUALS', 'NOT EQUALS', 'LESS', 'GREATER', 'LESS EQUALS', 'GREATER EQUALS', 'LIKE', 'NOT LIKE', 'ILIKE', 'NOT ILIKE', 'IN', 'NOT IN', 'BETWEEN', 'NOT BETWEEN', 'NULL', 'NOT NULL', 'CONTAINS', 'OVERLAP', 'HAS'],
		description: 'Comparison operator.'
	}
});

onetype.DataSchema('database.join', {
	addon: ['string', null, true],
	field: ['string', null, true],
	output: ['string'],
	select: {
		type: 'array',
		each: {
			type: 'string'
		}
	}
});

onetype.DataSchema('database.query', {
	filters: {
		type: 'array',
		each: {
			type: 'object',
			config: 'database.filter'
		}
	},
	page: ['number', 1],
	limit: ['number', 10],
	sort_field: ['string'],
	sort_direction: ['string', 'asc']
});
