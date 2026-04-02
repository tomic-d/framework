import ai from '#ai/addon.js';

ai.pipelines.Fn('run', async function(id, input = {}, parent = null)
{
	const pipeline = ai.pipelines.ItemGet(id);

	if(!pipeline)
	{
		throw onetype.Error(404, 'Pipeline :id: not found.', { id });
	}

	const context = parent || {
		input,
		results: {},
		history: []
	};

	if(!parent)
	{
		context.results._input = input;
	}

	const steps = pipeline.Get('steps');

	for(const step of steps)
	{
		if(step.loop)
		{
			const parts = step.loop.split('.');
			let items = context.results;

			for(const part of parts)
			{
				items = items?.[part];
			}

			if(!Array.isArray(items))
			{
				continue;
			}

			const results = [];

			for(const item of items)
			{
				const scoped = {
					input: item,
					results: { ...context.results, _current: item },
					history: context.history
				};

				const result = await ai.pipelines.Fn('execute', step, scoped);
				results.push(result);
			}

			context.results[step.id] = results;
		}
		else
		{
			const result = await ai.pipelines.Fn('execute', step, context);

			if(result !== null)
			{
				context.results[step.id] = result;
			}
		}
	}

	pipeline.Set('usage', pipeline.Get('usage') + 1);

	return context.results;
});
