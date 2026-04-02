import ai from '#ai/addon.js';

ai.orchestrators.Fn('item.state', function(item, overrides = {})
{
	const agents = Object.values(ai.agents.Items()).map((agent) =>
	{
		if(agent.Get('condition') && !agent.Get('condition')())
		{
			return false;
		}

		return {
			id: agent.Get('id'),
			description: agent.Get('description'),
			input: agent.Get('input'),
			output: agent.Get('output')
		};
	});

	const state = {
		step: 0,
		prompt: item.Get('prompt'),
		tokens: { input: 0, output: 0 },
		agents: agents.filter(Boolean),
		data: item.Get('data')
	};

	return Object.assign(state, overrides);
});