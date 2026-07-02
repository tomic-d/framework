import onetype from '#framework/load.js';

onetype.DataSchema('database.sync.schema', {
	table: {
		type: 'object',
		description: 'The introspected table.',
		config: {
			name:   { type: 'string', required: true, description: 'Physical table name.' },
			exists: { type: 'boolean', value: false, description: 'Whether the table exists.' }
		}
	},
	columns: {
		type: 'object',
		value: {},
		description: 'Live columns as the driver reports them, keyed by column name.'
	},
	indexes: {
		type: 'array',
		value: [],
		description: 'Live indexes on the table.',
		each: {
			type: 'object',
			config: {
				name:    { type: 'string', required: true, description: 'Index name.' },
				columns: { type: 'array', each: { type: 'string' }, description: 'Indexed columns.' },
				unique:  { type: 'boolean', value: false, description: 'Whether the index is unique.' }
			}
		}
	},
	relations: {
		type: 'array',
		value: [],
		description: 'Live foreign key constraint names.',
		each: { type: 'string' }
	}
});
