import onetype from '#framework/load.js';

onetype.DataSchema('database.filter', {
	field: {
		type: 'string',
		required: true
	},
	value: {
		type: 'string|number|boolean|array'
	},
	operator: {
		type: 'string',
		value: 'EQUALS'
	}
});
