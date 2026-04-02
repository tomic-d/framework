import ai from '#ai/addon.js';


ai.agents.Fn('item.execute', async function(item, payload, stream = null)
{
	const provider = item.Get('provider') ? ai.providers.ItemGet(item.Get('provider')) : ai.providers.Fn('default');

	if (!provider)
	{
		throw new Error('Provider not found: ' + (item.Get('provider') || 'default'));
	}

	const result = await provider.Fn('request', payload, stream);

	const meta = { 
		time: result.time,
		tokens: result.tokens,
		tps: result.tps,
		reasoning: result.reasoning
	};

	if (item.Get('format') === 'text')
	{
		return { content: result.content, _meta: meta };
	}

	let parsed;

	try
	{
		parsed = JSON.parse(result.content);
	}
	catch (error)
	{
		throw new Error('Failed to parse agent response as JSON: ' + result.content.slice(0, 200));
	}

	parsed._meta = meta;

	return parsed;
});
