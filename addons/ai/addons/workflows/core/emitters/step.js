onetype.EmitRegister('workflows.step', {
	description: 'Fired right before a workflow step executes, including steps inside loops.',
	metadata: { addon: 'ai.workflows' },
	config: {
		id: {
			type: 'string',
			description: 'ID of the workflow.'
		},
		goal: {
			type: 'string',
			description: 'Goal of the step about to run.'
		}
	}
});
