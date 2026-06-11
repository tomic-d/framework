import onetype from '#framework/load.js';
import ai from '#ai/addon.js';

onetype.AddonReady('commands', (commands) =>
{
	commands.Item({
		id: 'ai:agents:list',
		description: 'List every registered AI agent with what it does.',
		metadata: { addon: 'ai.agents' },
		out: {
			agents: {
				type: 'array',
				each: {
					type: 'object',
					config: {
						id: {
							type: 'string',
							description: 'Agent id.'
						},
						name: {
							type: 'string',
							description: 'Human readable agent name.'
						},
						description: {
							type: 'string',
							description: 'What the agent does.'
						}
					}
				},
				description: 'Registered agents.'
			}
		},
		callback: function(properties, resolve)
		{
			const agents = Object.values(ai.agents.Items()).filter((agent) =>
			{
				return !agent.Get('condition') || agent.Get('condition')();
			}).map((agent) =>
			{
				return {
					id: agent.Get('id'),
					name: agent.Get('name'),
					description: agent.Get('description')
				};
			});

			resolve({ agents }, agents.length + ' agents registered: ' + agents.map((agent) => agent.id).join(', ') + '.');
		}
	});
});
