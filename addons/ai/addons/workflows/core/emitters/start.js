onetype.EmitRegister('workflows.start', {
	description: 'Fired when a workflow run starts, before planning.',
	metadata: { addon: 'ai.workflows' },
	config: {
		id: {
			type: 'string',
			description: 'ID of the workflow.'
		},
		prompt: {
			type: 'string',
			description: 'The goal the workflow plans and executes.'
		}
	}
});
