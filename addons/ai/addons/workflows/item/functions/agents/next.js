import ai from '#ai/addon.js';

ai.workflows.Fn('item.agents.next', async function(item, state, task)
{
	/* After a failure the worker gets the full agent list, recovery
	   often needs tools the task planner did not anticipate. */

	const subset = !task.recovery && task.agents && task.agents.length ? state.agents.filter((agent) => task.agents.includes(agent.id)) : state.agents;

	const { content, meta } = await ai.agents.ItemGet('workflow-next').Fn('run', {
		goal: state.prompt,
		task: task.goal,
		agents: subset,
		log: task.log
	});

	state.tokens.input += meta.tokens.input;
	state.tokens.output += meta.tokens.output;

	return content;
});
