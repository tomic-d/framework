import onetype from '#framework/load.js';

onetype.DataSchema('database.query', {
	page: {
		type: 'number',
		value: 1,
		description: 'Page number, 1-based.'
	},
	limit: {
		type: 'number',
		value: 10,
		description: 'Rows per page.'
	},
	sort_field: {
		type: 'string',
		description: 'Field to sort by.'
	},
	sort_direction: {
		type: 'string',
		value: 'asc',
		description: 'Sort direction: asc or desc.'
	}
});
