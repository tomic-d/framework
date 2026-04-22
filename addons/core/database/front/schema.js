onetype.DataSchema('filter', {
	field: ['string', null, true],
	value: ['string|number|boolean|array'],
	operator: ['string', 'EQUALS']
});

onetype.DataSchema('join', {
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

onetype.DataSchema('query', {
	filters: {
		type: 'array',
		each: {
			type: 'object',
			config: 'filter'
		}
	},
	page: ['number', 1],
	limit: ['number', 10],
	sort_field: ['string'],
	sort_direction: ['string', 'asc']
});
