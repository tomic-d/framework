import ai from '#ai/addon.js';

ai.orchestrators.Fn('item.modes.action', async function(item, state)
{
	this.methods.resolve = (value) =>
	{
		if(typeof value !== 'string' || !value.startsWith('$'))
		{
			return value;
		}

		return onetype.Function(value.slice(1), state.data);
	};

	this.methods.input = (input) =>
	{
		const resolved = {};

		for(const [key, value] of Object.entries(input || {}))
		{
			resolved[key] = this.methods.resolve(value);
		}

		return resolved;
	};

	this.methods.check = (step) =>
	{
		if(!step.if)
		{
			return true;
		}

		return !!this.methods.resolve(step.if);
	};

	this.methods.agent = async (step) =>
	{
		if(!this.methods.check(step))
		{
			console.log(step);

			item.Fn('history', 'assistant', 'Condition not met, skipped: ' + step.agent);
			return;
		}

		const result = await item.Fn('agents.execute', state, step.agent, this.methods.input(step.input));

		if(step.as)
		{
			state.data[step.as] = result;
		}

		item.Fn('history', 'assistant', 'Ran "' + step.agent + '" and got output keys: ' + Object.keys(result) + (step.as ? '. Stored all as $' + step.as : ''));
	};

	this.methods.loop = async (step) =>
	{
		// if(!this.methods.check(step))
		// {
		// 	return item.Fn('history', 'assistant', 'Condition not met, skipped loop: ' + step.goal);
		// }

		const items = this.methods.resolve(step.loop);

		if(!Array.isArray(items) || !items.length)
		{
			return item.Fn('history', 'assistant', 'Loop skipped, empty or not array: ' + step.loop);
		}

		item.Fn('history', 'assistant', 'Looping ' + items.length + ' items.');

		/* Plan once with first item */

		const fields = Object.keys(items[0] || {}).join(', ');
		const prompt = step.goal + '. $item is available with fields: ' + fields + '. Use $item directly.';

		for(let i = 0; i < items.length; i++)
		{
			const child = ai.orchestrators.Item({
				parent: item.Get('id'),
				prompt,
				data: { item: items[i] },
				steps: 10,
			});

			await child.Fn('run');

			state.tokens.input += child.Get('state')?.tokens?.input || 0;
			state.tokens.output += child.Get('state')?.tokens?.output || 0;

			child.Remove();
		}
	};

	this.methods.execute = async (steps) =>
	{
		for(const step of steps)
		{
			if(step.loop)
			{
				item.Fn('history', 'user', step.goal);
				await this.methods.loop(step);
			}
			else if(step.agent)
			{
				item.Fn('history', 'user', step.goal);
				await this.methods.agent(step);
			}
		}
	};

	/* Plan */

	const { steps, reasoning, conclusion, achievable } = await item.Fn('agents.steps', state, state.prompt, state.data);

	console.log(item.Get('id'), reasoning, steps);
	if(!achievable)
	{
		item.Fn('history', 'assistant', 'Not achievable: ' + reasoning);
		item.Fn('emit', 'onFail', { reasoning, conclusion });
		return;
	}

	item.Fn('history', 'assistant', reasoning);
	item.Fn('emit', 'onStep', { status: 'planned', conclusion, steps });

	/* Execute */

	await this.methods.execute(steps);
});
