onetype.AddonReady('agents', (agents) =>
{
	agents.Item({
		id: 'orchestrator-achievable',
		name: 'Orchestrator Achievable',
		description: 'Checks if the planned tasks can be executed by the available agents',
		instructions: `
			You receive a list of planned tasks and a list of available agents.
			For each task, determine if the required actions can be performed by the available agents.
			Agents can be chained, repeated, and used conditionally by an orchestrator.
			Filtering, looping, and conditional logic are handled by the orchestrator — not by agents.
			A task is achievable if the underlying actions (list, create, delete, etc.) have matching agents.
			Only reject when the action type itself has no matching agent.
		`,
		tokens: 1000,
		input: {
			tasks: {
				type: 'array',
				description: 'Planned tasks [{task, order}]'
			},
			agents: {
				type: 'array',
				description: 'Available agents [{id, description}]'
			}
		},
		output: {
			achievable: {
				type: 'boolean',
				description: 'true if all tasks can be handled by available agents'
			},
			rejected: {
				type: 'array',
				description: 'Tasks that no agent can handle [{task, reason}]'
			}
		}
	});
});
