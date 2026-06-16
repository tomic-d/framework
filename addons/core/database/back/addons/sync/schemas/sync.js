import onetype from '#framework/load.js';

onetype.DataSchema('database.sync', {
	connection: {
		type: 'string',
		required: true,
		description: 'Connection id this step applies to.'
	},
	addon: {
		type: 'string',
		required: true,
		description: 'Addon whose table this step syncs.'
	},
	table: {
		type: 'string',
		required: true,
		description: 'Physical table name.'
	},
	prune: {
		type: 'boolean',
		value: false,
		description: 'Whether extra columns may be dropped.'
	},
	exists: {
		type: 'boolean',
		value: false,
		description: 'Whether the table already exists.'
	},
	create: {
		type: 'array',
		value: [],
		description: 'Columns to create with the new table (empty if it exists).',
		each: {
			type: 'object',
			config: 'database.column'
		}
	},
	add: {
		type: 'array',
		value: [],
		description: 'Missing columns to add to the existing table.',
		each: {
			type: 'object',
			config: 'database.column'
		}
	},
	index: {
		type: 'array',
		value: [],
		description: 'Index groups to create, each a list of column names.',
		each: {
			type: 'array',
			each: {
				type: 'string'
			}
		}
	},
	unique: {
		type: 'array',
		value: [],
		description: 'Unique constraint groups to create, each a list of column names.',
		each: {
			type: 'array',
			each: {
				type: 'string'
			}
		}
	},
	extra: {
		type: 'array',
		value: [],
		description: 'Columns present in the table but not in the schema.',
		each: {
			type: 'string'
		}
	},
	mismatched: {
		type: 'array',
		value: [],
		description: 'Columns whose DB type does not match the schema (JSON expected).',
		each: {
			type: 'string'
		}
	}
});
