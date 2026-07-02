import onetype from '#framework/load.js';

onetype.DataSchema('database.column', {
	name: {
		type: 'string',
		required: true,
		description: 'Column name.'
	},
	type: {
		type: 'string',
		required: true,
		options: ['string', 'number', 'boolean', 'object', 'array'],
		description: 'Declared field type.'
	},
	value: {
		type: 'any',
		description: 'Default value, if any.'
	},
	required: {
		type: 'boolean',
		value: false,
		description: 'Whether the column is NOT NULL with a default.'
	},
	primary: {
		type: 'boolean',
		value: false,
		description: 'Whether the column is the primary key.'
	},
	auto: {
		type: 'boolean',
		value: false,
		description: 'Whether the primary key auto-increments (DB assigns it).'
	},
	bounded: {
		type: 'boolean',
		value: false,
		description: 'Whether the column needs a bounded (varchar) type for keys.'
	}
});
