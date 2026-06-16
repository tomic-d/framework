import onetype from '#framework/load.js';

onetype.DataSchema('database.join', {
	addon: {
		type: 'string',
		required: true
	},
	field: {
		type: 'string',
		required: true
	},
	output: {
		type: 'string'
	},
	select: {
		type: 'array',
		each: {
			type: 'string'
		}
	}
});
