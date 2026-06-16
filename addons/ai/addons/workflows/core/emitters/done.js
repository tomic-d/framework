onetype.EmitRegister('workflows.done', {
	description: 'Fired when a workflow run ends, whatever the outcome.',
	metadata: { addon: 'ai.workflows' },
	config: {
		id: {
			type: 'string',
			description: 'ID of the workflow.'
		},
		status: {
			type: 'string',
			description: 'Final status, completed or failed.'
		},
		summary: {
			type: 'string',
			description: 'Closing summary of the run, null when it failed before summarizing.'
		}
	}
});
