import orchestrator from '#orchestrator/addon.js';

orchestrator.Fn('item.modes.action', async function(item, state)
{
	this.methods.execute = async (task) =>
	{
		item.Fn('emit', 'onStep', { agent: task.agent.id, task: task.task, status: 'running' });

		try
		{
			const local = item.Fn('state', {
				prompt: state.prompt,
				task: task.task,
				agent: task.agent,
				history: state.history
			});

			await item.Fn('agents.properties', local);
			await item.Fn('agents.execute', local);

			state.tokens.input += local.tokens.input;
			state.tokens.output += local.tokens.output;

			const execution = typeof local.execution === 'object' ? JSON.stringify(local.execution) : String(local.execution || '');
			const result = { agent: task.agent.id, task: task.task, execution, status: 'success' };

			item.Fn('emit', 'onStep', result);

			return result;
		}
		catch (error)
		{
			const execution = 'Failed: ' + (error.message || 'unknown error');
			const result = { agent: task.agent.id, task: task.task, execution, status: 'fail' };

			item.Fn('emit', 'onStep', result);

			return result;
		}
	};

	this.methods.batch = async (tasks, concurrency) =>
	{
		for (let i = 0; i < tasks.length; i += concurrency)
		{
			const batch = tasks.slice(i, i + concurrency);

			const results = await Promise.allSettled(batch.map(task => this.methods.execute(task)));

			for (const entry of results)
			{
				const result = entry.value;

				if (result)
				{
					state.history.push({ role: 'user', content: '[' + result.agent + '] ' + result.task, agent: result.agent });
					state.history.push({ role: 'assistant', content: result.execution, agent: result.agent });
				}
			}
		}
	};

	const { steps, concurrency } = item.Get(['steps', 'concurrency']);

	item.Fn('history', 'user', state.prompt);
	state.history = [...item.Get('history')];

	while (state.step < steps)
	{
		state.step++;

		const { tasks, message } = await item.Fn('agents.tasks', state);

		if (tasks.length === 0)
		{
			item.Fn('emit', 'onTasks', { tasks, message, state });
			break;
		}

		item.Fn('emit', 'onTasks', { tasks, message, state });

		await this.methods.batch(tasks, concurrency);
	}
});
