import onetype from '#framework/load.js';

onetype.DataSchema('database.query', {
	filters: {
		type: 'array',
		each: {
			type: 'object',
			config: 'database.filter'
		}
	},
	page: {
		type: 'number',
		value: 1
	},
	limit: {
		type: 'number',
		value: 10
	},
	sort_field: {
		type: 'string'
	},
	sort_direction: {
		type: 'string',
		value: 'asc'
	}
});
