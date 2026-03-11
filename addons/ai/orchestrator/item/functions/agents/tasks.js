import agents from '#agents/load.js';
import orchestrator from '#orchestrator/addon.js';

orchestrator.Fn('item.agents.tasks', async function(item, state)
{
	const payload = {
		goal: state.prompt,
		agents: state.agents
	};

	const result = await agents.ItemGet('orchestrator-tasks').Fn('run', payload, state.history);

	state.tokens.input += result._meta.tokens.input;
	state.tokens.output += result._meta.tokens.output;

	const tasks = result.tasks.map((task) =>
	{
		return {
			task: task.task,
			agent: state.agents.find((agent) => agent.id === task.agent)
		};
	}).filter((task) => task.agent);

	return { tasks, message: result.message };
});
