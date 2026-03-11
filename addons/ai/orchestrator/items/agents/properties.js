onetype.AddonReady('agents', (agents) =>
{
	agents.Item({
		id: 'orchestrator-properties',
		name: 'Orchestrator Properties',
		description: 'Generates input properties for an agent based on the task description',
		instructions: `
			#1. The task text contains field=value pairs. Match each value to the correct schema field by meaning.
			#2. [agent_id] conclusions in history may contain IDs and values from previous steps. Use them.
			#3. Copy values EXACTLY as written. Never modify, rephrase, or append text to any value.
			#4. IDs are always numbers or numeric strings from conclusions. Never use names as IDs.
			#5. If a schema field has no matching value in the task or history, set it to null.
			#6. Never invent or guess values that do not appear in the input.
		`,
		condition: () => false,
		tokens: 1000,
		input: {
			task: {
				type: 'string',
				description: 'Self-contained task text with field=value pairs'
			},
			agent: {
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
					config: {
						type: 'string',
						description: 'Input fields this agent requires'
					}
				}
			}
		},
		output: function({input})
		{
			console.log(input);
			return input.agent.config;
		}
	});
});