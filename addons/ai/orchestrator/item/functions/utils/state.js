import orchestrator from '#orchestrator/addon.js';
import agents from '#agents/addon.js';

orchestrator.Fn('item.state', function(item, data = {})
{
	const state = {
		prompt: item.Get('prompt'),
		agents: Object.values(agents.Items()).map((agent) =>
		{
			if(agent.Get('condition') && !agent.Get('condition')())
			{
				return false;
			}

			return {
				id: agent.Get('id'),
				description: agent.Get('description'),
				config: agent.Get('input')
			};
		}).filter(Boolean),

		history: [...item.Get('history')],

		task: null,
		agent: null,
		properties: {},
		execution: null,

		step: 0,

		tokens: { input: 0, output: 0 }
	};

	return Object.assign(state, data);
});