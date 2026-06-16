onetype.EmitRegister('workflows.plan', {
	description: 'Fired when the workflow plan is accepted, before execution.',
	metadata: { addon: 'ai.workflows' },
	config: {
		id: {
			type: 'string',
			description: 'ID of the workflow.'
		},
		goals: {
			type: 'array',
			each: { type: 'string' },
			description: 'Goals of the planned top level steps, in order.'
		}
	}
});
