import onetype from '#framework/load.js';

onetype.DataSchema('database.sync.plan', {
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
		type: 'object',
		description: 'The physical table this plan targets.',
		config: {
			name:   { type: 'string', required: true, description: 'Physical table name.' },
			exists: { type: 'boolean', value: false, description: 'Whether the table already exists.' }
		}
	},
	columns: {
		type: 'object',
		description: 'Column changes.',
		config: {
			write: {
				type: 'array',
				value: [],
				description: 'Columns to write: the whole table when it does not exist yet, otherwise the missing ones to add.',
				each: { type: 'object', config: 'database.sync.column' }
			},
			extra: {
				type: 'array',
				value: [],
				description: 'Columns present in the table but not in the schema.',
				each: { type: 'string' }
			},
			mismatched: {
				type: 'array',
				value: [],
				description: 'Columns whose DB type does not match the schema (JSON expected).',
				each: { type: 'string' }
			}
		}
	},
	keys: {
		type: 'object',
		description: 'Primary key, indexes and unique constraints to create.',
		config: {
			primary: {
				type: 'array',
				value: [],
				description: 'Composite primary key column names (empty for a single-column key handled per column).',
				each: { type: 'string' }
			},
			index: {
				type: 'array',
				value: [],
				description: 'Index groups to create, each a list of column names.',
				each: { type: 'array', each: { type: 'string' } }
			},
			unique: {
				type: 'array',
				value: [],
				description: 'Unique constraint groups to create, each a list of column names.',
				each: { type: 'array', each: { type: 'string' } }
			}
		}
	},
	relations: {
		type: 'array',
		value: [],
		description: 'Foreign keys to add.',
		each: {
			type: 'object',
			config: {
				name:     { type: 'string', required: true, description: 'Constraint name.' },
				field:    { type: 'string', required: true, description: 'Local column.' },
				column:   { type: 'string', required: true, description: 'Referenced column.' },
				table:    { type: 'string', required: true, description: 'Referenced table.' },
				onDelete: { type: 'string', description: 'ON DELETE action, if any.' },
				onUpdate: { type: 'string', description: 'ON UPDATE action, if any.' }
			}
		}
	},
	prune: {
		type: 'boolean',
		value: false,
		description: 'Whether extra columns may be dropped.'
	}
});
