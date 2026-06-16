import ai from '#ai/addon.js';

ai.workflows.Fn('item.agents.execute', async function(item, state, id, input)
{
	const agent = ai.agents.ItemGet(id);

	if(!agent)
	{
		throw onetype.Error(404, 'Workflow step uses unknown agent :id:.', { id });
	}

	const { content, meta } = await agent.Fn('run', input);

	state.tokens.input += meta.tokens.input;
	state.tokens.output += meta.tokens.output;

	return content;
});
