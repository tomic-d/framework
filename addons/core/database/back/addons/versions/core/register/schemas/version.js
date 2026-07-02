import onetype from '#framework/load.js';

onetype.DataSchema('database.version', {
	id: {
		type: 'number',
		description: 'Version row id (monotonic, the cutoff unit for time-travel).'
	},
	site_id: {
		type: 'number',
		description: 'Owning site id, if scoped.'
	},
	addon: {
		type: 'string',
		required: true,
		description: 'Addon name the version belongs to.'
	},
	entity_id: {
		type: 'number|string',
		required: true,
		description: 'Entity id the version belongs to.'
	},
	operation: {
		type: 'string',
		required: true,
		options: ['create', 'update', 'delete'],
		description: 'What produced this version row.'
	},
	changes: {
		type: 'object',
		required: true,
		description: 'Field diff as { field: { old, new } }.'
	},
	language: {
		type: 'string',
		description: 'Language code for a translation version, null for the base row.'
	},
	created_at: {
		type: 'string',
		metadata: { cast: 'date' },
		description: 'When the version row was written.'
	}
});
