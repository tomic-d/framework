import ai from '#ai/addon.js';

ai.agents.Item({
	id: 'workflow-next',
	name: 'Workflow Next',
	description: 'Finishes one task by choosing one step at a time.',
	condition: () => false,
	tokens: 3000,
	instructions: `
You finish one task by choosing one step at a time.

You receive the overall goal, your task, the available agents and the log of everything you already did, with results and failures.

Decide the single next step: one agent with its input. Then:
- Input values are literals, or $ expressions referencing names you stored, like $page.id or $copy.text.
- Long values like html or css ALWAYS travel by $ reference, like $hero.html, NEVER copied literally into input.
- Always set as, it names where the result is stored.
- Read the log first. Never repeat a call that already succeeded with the same input. When the log already satisfies a part of the task, do not redo or improve it.
- After a FAILED line change something, different input or a different agent, never the same failing call again.
- In reasoning, walk the task text requirement by requirement: created? described? seo? sections? form? whatever the task names. Achieved true ONLY when the log proves every single one.
- Before declaring achieved on a task that built or changed something, verify ONCE with a reading agent when one exists, and only declare achieved when the read confirms every requirement.
- Texts you pass as input are in the language the task asks for, otherwise the language of the goal.
- Stay strictly inside your task, other workers handle the rest of the goal. Do ONLY what the task names, never add extras.
	`,
	input: {
		goal: {
			type: 'string',
			required: true,
			description: 'The overall goal of the workflow.'
		},
		task: {
			type: 'string',
			required: true,
			description: 'The task this worker must finish.'
		},
		agents: {
			type: 'array',
			description: 'Available agents.',
			each: {
				type: 'object',
				config: {
					id: {
						type: 'string',
						description: 'Agent id.'
					},
					description: {
						type: 'string',
						description: 'What this agent does.'
					},
					input: {
						type: 'object',
						description: 'Input fields this agent accepts.'
					},
					output: {
						type: 'object',
						description: 'Output fields this agent returns.'
					}
				}
			}
		},
		log: {
			type: 'array',
			each: { type: 'string' },
			description: 'What already happened in this task, in order.'
		}
	},
	output: {
		reasoning: {
			type: 'string',
			description: 'Max 40 words. List every requirement of the task as proven or missing, then why this step or why achieved. Achieved is a lie unless every requirement is proven.'
		},
		achieved: {
			type: 'boolean',
			description: 'True as soon as every requirement named in the task shows as done in the log. False only when something concrete is still missing.'
		},
		goal: {
			type: 'string',
			required: false,
			description: 'What this step does, max 10 words. Null when achieved.'
		},
		agent: {
			type: 'string',
			required: false,
			description: 'Agent id to run. Null when achieved.'
		},
		input: {
			type: 'object',
			required: false,
			description: 'Input for the agent, literals or $ expressions. Null when achieved.'
		},
		as: {
			type: 'string',
			required: false,
			description: 'Name the result is stored under. Null when achieved.'
		}
	}
});
