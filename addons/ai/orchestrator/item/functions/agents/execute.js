import agents from '#agents/load.js';
import orchestrator from '#orchestrator/addon.js';

orchestrator.Fn('item.agents.execute', async function(item, state)
{
	const agent = agents.ItemGet(state.agent.id);

	console.log(state.properties);

	const result = await agent.Fn('run', state.properties);

	const { _meta, ...rest } = result;

	state.execution = rest;

	state.tokens.input += result._meta?.tokens?.input || 0;
	state.tokens.output += result._meta?.tokens?.output || 0;

	return result;
});
