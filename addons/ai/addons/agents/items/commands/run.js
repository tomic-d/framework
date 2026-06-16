import onetype from '#framework/load.js';
import ai from '#ai/addon.js';

onetype.AddonReady('commands', (commands) =>
{
	commands.Item({
		id: 'ai:agents:run',
		description: 'Run one AI agent by id with the given input and return its output. The input is validated against the agent input schema, the output against its output schema.',
		metadata: { addon: 'ai.agents' },
		in: {
			id: {
				type: 'string',
				required: true,
				description: 'ID of the agent to run.'
			},
			input: {
				type: 'object',
				value: {},
				description: 'Input for the agent, shaped by the agent input schema.'
			},
			history: {
				type: 'array',
				value: [],
				each: {
					type: 'object',
					config: {
						role: {
							type: 'string',
							required: true,
							description: 'Message author, one of user or assistant.'
						},
						content: {
							type: 'string',
							required: true,
							description: 'Message text.'
						}
					}
				},
				description: 'Prior conversation messages, oldest first. Injected between the system prompt and the user message.'
			}
		},
		out: {
			output: {
				type: 'object',
				description: 'Agent output, shaped by the agent output schema.'
			},
			time: {
				type: 'string',
				description: 'Model time of the run in milliseconds.'
			},
			tokens: {
				type: 'object',
				config: {
					input: {
						type: 'number',
						description: 'Prompt tokens the run consumed.'
					},
					output: {
						type: 'number',
						description: 'Tokens the model generated.'
					}
				},
				description: 'Token usage of the run.'
			}
		},
		callback: async function(properties, resolve)
		{
			const agent = ai.agents.ItemGet(properties.id);

			if(!agent)
			{
				return resolve(null, 'Agent ' + properties.id + ' does not exist.', 404);
			}

			try
			{
				const { content, meta } = await agent.Fn('run', properties.input, properties.history);

				resolve({ output: content, time: meta.time, tokens: meta.tokens }, 'Agent ' + properties.id + ' ran in ' + meta.time + ' ms.');
			}
			catch(error)
			{
				resolve(null, 'Agent ' + properties.id + ' failed: ' + error.message, error.code && error.code >= 400 ? error.code : 500);
			}
		}
	});
});
