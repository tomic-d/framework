import ai from '#ai/addon.js';

ai.agents.Item({
	id: 'workflow-tasks',
	name: 'Workflow Tasks',
	description: 'Splits a goal into independent tasks for parallel workers.',
	condition: () => false,
	tokens: 2000,
	instructions: `
You split a goal into a short list of tasks for parallel workers.

- Cover ONLY what the goal explicitly asks for. Never add extra work, no seo, sections, forms or pages the goal does not name. A simple goal is often a single task.
- Each task is ONE self contained piece of work in one sentence, carrying every name, text and detail it needs from the goal. The worker sees only the task and the overall goal.
- Group by outcome, not by action. Everything for one page is ONE task, the worker handles its inner steps alone. NEVER split one page into create, write and update tasks.
- Tasks NEVER overlap. Every page or item is owned by exactly one task, no other task touches it.
- NEVER create separate verify or check tasks, verification is built into every worker.
- Example: "pages Pocetna and Meni with Serbian descriptions, then tidy" becomes exactly 3 tasks: pocetna, meni, tidy with needs on both.
- Example: "update the description of page X to French" is exactly ONE task, writing and applying belong together.
- 2 to 8 tasks, the fewest that cover the whole goal. When in doubt, fewer bigger tasks. A goal asking for one thing is ONE task.
- needs lists ids of tasks that must finish first. Independent tasks run at the same time. A final arranging or checking task needs all the others.
- A worker runs as MANY agent calls as its task needs, one after another. A task never maps to a single agent.
- Each task lists in agents the ids of every agent its worker will need, including reading agents for verification. Forgotten agents are unavailable to the worker.
- Achievable is false only when some required action has no agent at all in the list. Combining agents is always possible.
	`,
	input: {
		prompt: {
			type: 'string',
			required: true,
			description: 'The goal to split into tasks.'
		},
		data: {
			type: 'object',
			description: 'Variables already available to the run.'
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
					}
				}
			}
		}
	},
	output: {
		reasoning: {
			type: 'string',
			description: 'Why these tasks and this order, max 50 words.'
		},
		achievable: {
			type: 'boolean',
			description: 'Whether the goal is fully achievable with the available agents. When false, tasks must be empty.'
		},
		tasks: {
			type: 'array',
			description: 'The tasks, in any order.',
			each: {
				type: 'object',
				config: {
					id: {
						type: 'string',
						required: true,
						description: 'Short task id, like pocetna-page or tidy.'
					},
					goal: {
						type: 'string',
						required: true,
						description: 'The self contained task, one sentence with every detail the worker needs.'
					},
					needs: {
						type: 'array',
						each: { type: 'string' },
						description: 'Ids of tasks that must finish first. Empty when independent.'
					},
					agents: {
						type: 'array',
						each: { type: 'string' },
						description: 'Ids of every agent the worker needs for this task, including reading agents for verification.'
					}
				}
			}
		},
		conclusion: {
			type: 'string',
			description: 'Short first person message about the plan, max 15 words.'
		}
	}
});
