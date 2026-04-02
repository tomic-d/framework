import ai from '#ai/addon.js';

ai.agents.Item({
	id: 'orchestrator-summary',
	name: 'Orchestrator Summary',
	description: 'Summarizes what happened during execution based on history.',
	instructions: `
You receive a conversation history of an AI assistant executing tasks.
Write a short, friendly first-person summary of what was done.
Include key results, numbers, and outcomes.
If something failed or was skipped, mention it briefly.
Keep it under 3 sentences.
	`,
	condition: () => false,
	tokens: 500,
	format: 'json',
	input: {
		history: {
			type: 'array',
			description: 'Conversation history of the execution'
		}
	},
	output: {
		summary: {
			type: 'string',
			description: 'Short first-person summary of what happened'
		}
	}
});
