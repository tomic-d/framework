import ai from '#ai/addon.js';

ai.workflows.Fn('item.agents.summary', async function(item, state)
{
	const { content, meta } = await ai.agents.ItemGet('workflow-summary').Fn('run', {
		history: item.Get('history')
	});

	state.tokens.input += meta.tokens.input;
	state.tokens.output += meta.tokens.output;

	return content.summary;
});
