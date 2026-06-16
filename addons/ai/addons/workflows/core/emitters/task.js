onetype.EmitRegister('workflows.task', {
	description: 'Fired when a workflow task changes state, running, done, failed or skipped.',
	metadata: { addon: 'ai.workflows' },
	config: {
		id: {
			type: 'string',
			description: 'ID of the workflow.'
		},
		goal: {
			type: 'string',
			description: 'Goal of the task.'
		},
		status: {
			type: 'string',
			description: 'New task status, running, done, failed or skipped.'
		}
	}
});
