import ai from '#ai/addon.js';

ai.agents.Item({
	id: 'workflow-summary',
	name: 'Workflow Summary',
	description: 'Summarizes what a workflow run did based on its history.',
	condition: () => false,
	tokens: 500,
	input: {
		history: {
			type: 'array',
			required: true,
			description: 'Conversation history of the run.',
			each: {
				type: 'object',
				config: {
					role: {
						type: 'string',
						required: true,
						description: 'Entry author.'
					},
					content: {
						type: 'string',
						required: true,
						description: 'Entry text.'
					}
				}
			}
		}
	},
	instructions: 'You receive the execution history of a workflow run. '
		+ 'Write a short factual summary of what was done: key results, numbers and outcomes. '
		+ 'If something failed or was skipped, say it plainly. Three sentences at most.',
	output: {
		summary: {
			type: 'string',
			description: 'Short summary of what happened.'
		}
	}
});
