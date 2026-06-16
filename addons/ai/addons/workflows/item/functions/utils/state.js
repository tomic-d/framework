import ai from '#ai/addon.js';

ai.workflows.Fn('item.state', function(item, overrides = {})
{
	const allowed = item.Get('agents');

	const agents = Object.values(ai.agents.Items()).filter((agent) =>
	{
		if(allowed.length && !allowed.includes(agent.Get('id')))
		{
			return false;
		}

		return !agent.Get('condition') || agent.Get('condition')();
	}).map((agent) =>
	{
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
		agents,
		data: item.Get('data'),
		tasks: [],
		summary: null
	};

	return Object.assign(state, overrides);
});
