onetype.AddonReady('agents', (agents) =>
{
	agents.Item({
		id: 'orchestrator-planner',
		name: 'Orchestrator Planner',
		description: 'Splits a user prompt into atomic tasks with ordering and parallelism',
		instructions: `
			Split the user prompt into logical steps.
			Each step is a distinct action or group of actions.
			Do not duplicate steps for unknown quantities — use one step to describe the repeated action.

			For each step:
			- task: what needs to be done
			- order: batch number. Steps that need results from earlier steps get a higher number. Independent steps share the same number.
		`,
		tokens: 2000,
		input: {
			prompt: {
				type: 'string',
				description: 'The full user prompt to split into tasks'
			}
		},
		output: {
			tasks: {
				type: 'array',
				description: 'Atomic tasks [{task, order}]'
			}
		}
	});
});
