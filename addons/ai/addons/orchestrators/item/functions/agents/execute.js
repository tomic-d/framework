import ai from '#ai/addon.js';

ai.orchestrators.Fn('item.agents.execute', async function(item, state, id, input)
{
	const agent = ai.agents.ItemGet(id);

	const result = await agent.Fn('run', input, item.Get('history'));
	const { _meta, ...rest } = result;

	state.tokens.input += result._meta.tokens.input;
	state.tokens.output += result._meta.tokens.output;

	return rest;
});
