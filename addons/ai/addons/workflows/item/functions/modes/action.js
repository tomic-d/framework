import ai from '#ai/addon.js';

ai.workflows.Fn('item.modes.action', async function(item, state)
{
	this.methods.resolve = (value, data) =>
	{
		if(typeof value !== 'string' || !value.startsWith('$'))
		{
			return value;
		}

		return onetype.Function(value.slice(1), Object.assign({}, data, { data }));
	};

	this.methods.input = (input, data) =>
	{
		const resolved = {};

		for(const [key, value] of Object.entries(input || {}))
		{
			let final = this.methods.resolve(value, data);

			/* The model often passes a whole output object where one of
			   its fields was meant, unwrap when the key matches. */

			if(final && typeof final === 'object' && !Array.isArray(final))
			{
				if(key in final)
				{
					final = final[key];
				}
				else if(Object.keys(final).length === 1)
				{
					final = Object.values(final)[0];
				}
			}

			resolved[key] = final;
		}

		return resolved;
	};

	this.methods.mark = (task, status) =>
	{
		task.status = status;
		onetype.Emit('workflows.task', { id: item.Get('id'), goal: task.goal, status });
	};

	/* One task: pick one step at a time until the worker declares it achieved.
	   Failures land in the log as observations, the worker recovers or gives up. */

	this.methods.task = async (task) =>
	{
		this.methods.mark(task, 'running');

		const seen = {};
		let failures = 0;
		let idle = 0;

		for(let iteration = 0; iteration < (task.cap || 30); iteration++)
		{
			let next;

			try
			{
				next = await item.Fn('agents.next', state, task);
			}
			catch(error)
			{
				failures++;
				task.log.push('Your previous decision failed to generate: ' + error.message + ' Keep the step small and the input short.');

				if(failures >= 3)
				{
					item.Fn('history', 'assistant', 'Task failed, the worker could not decide: ' + task.goal);

					return this.methods.mark(task, 'failed');
				}

				continue;
			}

			if(next.achieved)
			{
				/* One confirmation pass: achieved only counts when the worker
				   proves every requirement against the log a second time. */

				if(!task.confirmed)
				{
					task.confirmed = true;
					task.log.push('CONFIRM: before this counts as achieved, list every requirement of the task with the log line proving it. Return achieved true again only if every proof exists, otherwise return the missing step.');

					continue;
				}

				item.Fn('history', 'assistant', 'Task done: ' + task.goal);

				return this.methods.mark(task, 'done');
			}

			if(!next.agent)
			{
				idle++;
				task.log.push('No step returned and the task is not achieved. Pick an agent or declare achieved.');
			}
			else
			{
				if(++state.step > item.Get('steps'))
				{
					throw onetype.Error(400, 'Workflow exceeded the limit of :steps: steps.', { steps: item.Get('steps') });
				}

				onetype.Emit('workflows.step', { id: item.Get('id'), goal: next.goal || next.agent });

				const name = next.as ? String(next.as).replace(/^\$+/, '') : null;
				let input = next.input;

				try
				{
					input = this.methods.input(next.input, task.data);

					const result = await item.Fn('agents.execute', state, next.agent, input);

					name && (task.data[name] = result);

					const key = next.agent + JSON.stringify(next.input);
					const snapshot = JSON.stringify(result);

					failures = 0;

					if(seen[key] === snapshot)
					{
						idle++;

						const unused = Object.keys(task.data).filter((stored) => !task.log.some((entry) => entry.includes('$' + stored) && entry.indexOf('$' + stored) > entry.indexOf('with')));

						task.log.push('Ran "' + next.agent + '" AGAIN and the result is UNCHANGED, it is already stored. USE what you have: ' + (unused.length ? 'stored results not passed to any agent yet: $' + unused.join(', $') + '.' : 'every requirement proven means achieved true.'));
					}
					else
					{
						idle = 0;
						task.confirmed = false;
						seen[key] = snapshot;

						const line = 'Ran "' + next.agent + '" with ' + JSON.stringify(input).slice(0, 200) + ' -> ' + snapshot.slice(0, 600) + (name ? ', stored as $' + name : '');

						task.log.push(line);
						item.Fn('history', 'assistant', line);
					}
				}
				catch(error)
				{
					failures++;
					task.recovery = true;

					const line = 'FAILED "' + next.agent + '" with ' + JSON.stringify(input).slice(0, 200) + ': ' + error.message;

					task.log.push(line);
					item.Fn('history', 'assistant', line);
				}
			}

			if(failures >= 3 || idle >= 3)
			{
				item.Fn('history', 'assistant', 'Task failed, ' + (idle >= 3 ? 'no progress' : 'repeated errors') + ': ' + task.goal);

				return this.methods.mark(task, 'failed');
			}
		}

		item.Fn('history', 'assistant', 'Task ran out of iterations: ' + task.goal);

		return this.methods.mark(task, 'failed');
	};

	/* Tasks */

	const planned = await item.Fn('agents.tasks', state);

	if(!planned.achievable)
	{
		item.Fn('history', 'assistant', 'Not achievable: ' + planned.reasoning);
		state.summary = planned.conclusion || planned.reasoning;

		return false;
	}

	/* The final check wave verifies everything, planner made verify
	   tasks only burn budget. */

	planned.tasks = planned.tasks.filter((task, index, all) =>
	{
		return all.length === 1 || !/^(verify|check|confirm|test)\b/i.test(task.goal);
	});

	state.tasks = planned.tasks.map((task) =>
	{
		return { id: task.id, goal: task.goal, needs: task.needs || [], agents: task.agents || [], status: 'pending', log: [], data: Object.assign({}, state.data), error: null };
	});

	item.Fn('history', 'assistant', planned.reasoning);
	onetype.Emit('workflows.plan', { id: item.Get('id'), goals: state.tasks.map((task) => task.goal) });

	/* Schedule: independent tasks run in parallel, capped by concurrency.
	   A task whose dependency failed is skipped, never silently dropped. */

	const cap = Math.min(item.Get('concurrency'), 5);
	const active = new Map();

	const find = (id) => state.tasks.find((task) => task.id === id);

	while(state.tasks.some((task) => ['pending', 'running'].includes(task.status)))
	{
		state.tasks.filter((task) =>
		{
			return task.status === 'pending' && task.needs.some((need) => ['failed', 'skipped'].includes((find(need) || {}).status));
		}).forEach((task) =>
		{
			task.log.push('Skipped, a task it needs failed.');
			item.Fn('history', 'assistant', 'Task skipped, a dependency failed: ' + task.goal);
			this.methods.mark(task, 'skipped');
		});

		state.tasks.filter((task) =>
		{
			return task.status === 'pending' && task.needs.every((need) => (find(need) || { status: 'done' }).status === 'done');
		}).slice(0, Math.max(0, cap - active.size)).forEach((task) =>
		{
			active.set(task, this.methods.task(task).catch((error) =>
			{
				task.error = error;
				this.methods.mark(task, 'failed');
			}).then(() => active.delete(task)));
		});

		if(!active.size)
		{
			break;
		}

		await Promise.race(active.values());
	}

	/* Safety net: nothing may end the run still pending. */

	state.tasks.filter((task) => task.status === 'pending').forEach((task) =>
	{
		task.log.push('Skipped, its dependencies never completed.');
		item.Fn('history', 'assistant', 'Task skipped, unreachable dependencies: ' + task.goal);
		this.methods.mark(task, 'skipped');
	});

	const exceeded = state.tasks.find((task) => task.error);

	if(exceeded)
	{
		throw exceeded.error;
	}

	/* Final check: one extra worker verifies the whole goal against the
	   real state and finishes whatever the tasks missed. */

	if(state.tasks.every((task) => task.status === 'done'))
	{
		const check = { id: 'final-check', goal: 'Check the original goal against the real current state using reading agents, and do whatever is still missing. The goal: ' + state.prompt, needs: [], agents: [], status: 'pending', log: [], data: Object.assign({}, state.data), error: null, cap: 60 };

		state.tasks.push(check);

		await this.methods.task(check).catch((error) => { check.error = error; this.methods.mark(check, 'failed'); });

		if(check.error)
		{
			throw check.error;
		}
	}

	/* Summarize */

	state.summary = await item.Fn('agents.summary', state);
	item.Fn('emit', 'onSummary', { summary: state.summary, state });

	return state.tasks.every((task) => task.status === 'done');
});
