import onetype from '#framework/load.js';

onetype.DataSchema('database.sync.column', {
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
	cast: {
		type: 'string',
		description: 'Semantic DB cast override from field metadata (e.g. date).'
	},
	length: {
		type: 'number',
		description: 'Varchar length for a string column.'
	},
	precision: {
		type: 'number',
		description: 'Total digits for a decimal column.'
	},
	scale: {
		type: 'number',
		description: 'Fractional digits for a decimal column.'
	},
	unsigned: {
		type: 'boolean',
		value: false,
		description: 'Whether the integer column is unsigned (foreign keys to an auto-increment primary key).'
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
