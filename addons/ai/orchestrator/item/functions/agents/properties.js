import agents from '#agents/load.js';
import orchestrator from '#orchestrator/addon.js';

orchestrator.Fn('item.agents.properties', async function(item, state)
{
	if (!state.agent.config || !Object.keys(state.agent.config).length)
	{
		state.properties = {};
		return;
	}

	const payload = {
		task: state.task,
		agent: state.agent
	};

	const result = await agents.ItemGet('orchestrator-properties').Fn('run', payload, state.history);

	const { _meta, ...rest } = result;

	state.properties = rest;

	state.tokens.input += result._meta.tokens.input;
	state.tokens.output += result._meta.tokens.output;
});
