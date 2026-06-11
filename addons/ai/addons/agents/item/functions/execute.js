import ai from '#ai/addon.js';

ai.agents.Fn('item.execute', async function(item, payload)
{
	const result = await onetype.PipelineRun('ai:agents:request', payload);

	if(result.code !== 200)
	{
		throw onetype.Error(result.code, result.message);
	}

	const meta = {
		time: result.time,
		tokens: result.data.usage
	};

	if(item.Get('format') === 'text')
	{
		return { content: result.data.content, _meta: meta };
	}

	let parsed;

	try
	{
		parsed = JSON.parse(result.data.content);
	}
	catch(error)
	{
		throw onetype.Error(500, 'Agent response is not valid JSON: ' + result.data.content.slice(0, 200));
	}

	parsed._meta = meta;

	return parsed;
});
