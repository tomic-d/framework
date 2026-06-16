import ai from '#ai/addon.js';

ai.workflows.Fn('item.agents.tasks', async function(item, state)
{
	const { content, meta } = await ai.agents.ItemGet('workflow-tasks').Fn('run', {
		prompt: state.prompt,
		data: state.data,
		agents: state.agents.map((agent) => ({ id: agent.id, description: agent.description }))
	});

	state.tokens.input += meta.tokens.input;
	state.tokens.output += meta.tokens.output;

	return content;
});
