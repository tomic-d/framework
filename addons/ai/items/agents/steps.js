import ai from '#ai/addon.js';

ai.agents.Item({
	id: 'orchestrator-steps',
	name: 'Orchestrator Steps',
	description: 'Plans linear execution steps for a goal.',
	instructions: `
You create execution steps from a goal and available agents.

STEPS:
- Agent: {"goal": "...", "agent": "id", "input": {...}, "as": "name"}
- Loop: {"goal": "task for one item", "loop": "$expression"}
- Any step can have "if": "$expression" to guard execution.

$ REFERENCES:
- $ prefix = JS expression. No $ = literal.
- Scope: all "as" results + "data" variables directly (not $data.x, just $x).

RULES:
1. Use only provided agent IDs.
2. Use only values from goal or $ references.
3. "as" stores the ENTIRE agent output object. To access a field, use $name.field. A loop over an array field inside the output must be $name.arrayField, never just $name.
4. Loop iterates arrays. Loop goal is for ONE item.
5. Use data variables when available.
6. Fewest steps.
7. No matching agent = achievable false.

FORMAT EXAMPLES:
- Agent: {"goal": "...", "agent": "x", "input": {"field": "literal"}, "as": "result"}
- Agent with ref: {"goal": "...", "agent": "y", "input": {"field": "$result.value"}, "as": "output"}
- Loop: {"goal": "process this item", "loop": "$result.items"}
- Agent in loop uses $item: {"goal": "...", "agent": "z", "input": {"field": "$item.name"}}
- Guarded agent: {"goal": "...", "agent": "z", "input": {...}, "if": "$output.flag"}
- JS in $ref: {"input": {"count": "$item.name.length", "upper": "$item.name.toUpperCase()"}}

REASONING:
- For each agent, state what it returns from the output schema.
- For each loop, trace: $name → output schema → array field → $name.field.
- For each $item reference, confirm it matches a field from the loop source array items.
	`,
	condition: () => false,
	tokens: 3000,
	input: {
		prompt: {
			type: 'string',
			description: 'The goal to plan execution for'
		},
		data: {
			type: 'object',
			description: 'Variables available in current scope. Reference with $ prefix.'
		},
		agents: {
			type: 'array',
			description: 'Available agents',
			each: {
				type: 'object',
				config: {
					id: {
						type: 'string',
						description: 'Agent ID'
					},
					description: {
						type: 'string',
						description: 'What this agent does'
					},
					input: {
						type: 'object',
						description: 'Input fields this agent accepts'
					},
					output: {
						type: 'object',
						description: 'Output fields this agent returns'
					}
				}
			}
		},
		pipelines: {
			type: 'array',
			description: 'Predefined step sequences. Use as-is or adapt to the goal. Higher usage = more proven.',
			each: {
				type: 'object',
				config: {
					id: {
						type: 'string',
						description: 'Pipeline ID'
					},
					name: {
						type: 'string',
						description: 'Pipeline name'
					},
					description: {
						type: 'string',
						description: 'What this pipeline does'
					},
					usage: {
						type: 'number',
						description: 'How many times this pipeline was used'
					},
					steps: {
						type: 'array',
						description: 'The predefined steps'
					}
				}
			}
		}
	},
	output: {
		reasoning: {
			type: 'string',
			description: 'Explain why this plan was chosen, what each step does, and how data flows between steps. If not achievable, explain what is missing. Always check input and output schema.'
		},
		achievable: {
			type: 'boolean',
			description: 'Whether the goal can be fully achieved with the available agents. If false, steps must be empty.'
		},
		steps: {
			type: 'array',
			description: 'Flat list of steps to execute',
			each: {
				type: 'object',
				config: {
					goal: {
						type: 'string',
						description: 'What this step does (max 20 words).'
					},
					agent: {
						type: 'string',
						required: false,
						description: 'Agent ID to call. Omit for loop steps.'
					},
					input: {
						type: 'object',
						required: false,
						description: 'Input for agent. Values can be literals or $ expressions.'
					},
					as: {
						type: 'string',
						required: false,
						description: 'Variable name to store result'
					},
					loop: {
						type: 'string',
						required: false,
						description: '$ expression that resolves to an array. Omit for agent steps.'
					},
					if: {
						type: 'string',
						required: false,
						description: '$ expression condition. Step executes only when truthy.'
					}
				}
			}
		},
		conclusion: {
			type: 'string',
			description: 'Short first-person message to the user (max 15 words). Speak as their assistant.'
		}
	}
});
