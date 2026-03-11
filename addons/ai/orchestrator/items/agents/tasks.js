onetype.AddonReady('agents', (agents) =>
{
	agents.Item({
		id: 'orchestrator-tasks',
		name: 'Orchestrator Tasks',
		description: 'Determines the next batch of independent tasks to execute in parallel',
		instructions: `
			#1. Return the next batch of independent tasks that can execute RIGHT NOW with available data. You will be called again after each batch completes.
			#2. Read [agent_id] conclusions in history to know what is already done. NEVER repeat a completed task.
			#3. Every value in a task MUST come from the user goal or from a [agent_id] conclusion in history. No placeholders. No invented IDs or names.
			#4. If a required value is missing (e.g. an ID that needs to be fetched first), return ONLY the prerequisite task that fetches it. Wait for the next batch.
			#5. Task text is the ONLY input the next step receives. Include ALL field=value pairs directly in the task text string.
			#6. One task = one agent = one action. Never combine two actions into one task.
			#7. Maximum 5 tasks per batch.
			#8. Agent ID in each task must exactly match one ID from the AVAILABLE AGENTS list.
			#9. Return empty tasks array when ALL work is complete.
			#10. Before returning tasks, rate your confidence (0-100) that every task has all required values and the correct agent. If confidence < 95, return empty tasks array and write a clarifying question in the message field. Never guess. Never assume.
			#11. If the user goal is not actionable (question, opinion, conversation) and cannot be completed with available agents, return empty tasks array and explain in the message field that this is not possible.
		`,
		condition: () => false,
		tokens: 2000,
		input: {
			goal: {
				type: 'string',
				description: 'The original user goal'
			},
			agents: {
				type: 'array',
				description: 'Available agents that can be used to execute tasks',
				each: {
					type: 'object',
					config: {
						id: {
							type: 'string',
							description: 'Agent ID to use in task assignment'
						},
						description: {
							type: 'string',
							description: 'What this agent does'
						},
						config: {
							type: 'string',
							description: 'Input fields this agent requires'
						}
					}
				}
			}
		},
		output: {
			reasoning: {
				type: 'string',
				description: 'What is done, what remains, what dependencies are blocking, and why these specific tasks are next'
			},
			confidence: {
				type: 'number',
				description: 'Confidence 0-100 that every task has all required values and the correct agent. Below 95 means tasks must be empty and message must ask a clarifying question.'
			},
			message: {
				type: 'string',
				description: 'Short user-facing message. If confidence < 95, ask a specific clarifying question. Otherwise explain what is being executed.'
			},
			tasks: {
				type: 'array',
				description: 'Tasks that can run RIGHT NOW with all values available. Empty array if done or waiting for dependencies.',
				each: {
					type: 'object',
					config: {
						task: {
							type: 'string',
							description: 'Self-contained task text with ALL field=value pairs needed. No placeholders. No references to history.'
						},
						agent: {
							type: 'string',
							description: 'Exact agent ID from the available agents list'
						}
					}
				}
			}
		}
	});
});