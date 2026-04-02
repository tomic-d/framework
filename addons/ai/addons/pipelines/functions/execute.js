import ai from '#ai/addon.js';

ai.pipelines.Fn('execute', async function(step, context)
{
	if(step.condition && !step.condition(context))
	{
		return null;
	}

	const input = {};

	if(step.input)
	{
		Object.assign(input, step.input);
	}

	if(step.map)
	{
		for(const [key, path] of Object.entries(step.map))
		{
			const parts = path.split('.');
			let value = context.results;

			for(const part of parts)
			{
				value = value?.[part];
			}

			input[key] = value;
		}
	}

	if(step.type === 'command')
	{
		return await $ot.command(step.command, input);
	}

	if(step.type === 'ai')
	{
		const agent = ai.agents.ItemGet(step.agent);

		if(!agent)
		{
			throw onetype.Error(404, 'Agent :id: not found.', { id: step.agent });
		}

		return await agent.Fn('run', input, context.history);
	}

	if(step.type === 'pipeline')
	{
		return await ai.pipelines.Fn('run', step.pipeline, input, context);
	}

	throw onetype.Error(400, 'Unknown step type :type:.', { type: step.type });
});
