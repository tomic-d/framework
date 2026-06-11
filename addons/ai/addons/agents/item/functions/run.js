import ai from '#ai/addon.js';

ai.agents.Fn('item.run', async function(item, input = {}, history = null)
{
	input = item.Get('input') ? onetype.DataDefine(input, item.Get('input')) : {};

	if (!item.Get('instructions'))
	{
		let output = {};

		item.Get('onAfter') && await item.Get('onAfter')({ input, output, payload: {} });

		output._meta = { time: '0.00', tokens: { input: 0, output: 0 } };

		return output;
	}

	const schema = typeof item.Get('output') === 'function' ? item.Get('output')({ input }) : item.Get('output');

	const payload = {
		tokens: item.Get('tokens'),
		messages: item.Fn('messages', input, history),
		temperature: item.Get('temperature'),
		top_p: item.Get('top_p'),
		top_k: item.Get('top_k'),
		presence_penalty: item.Get('presence_penalty')
	};

	if (item.Get('format') === 'json')
	{
		payload.schema = item.Fn('schema', schema);
	}

	item.Get('onBefore') && item.Get('onBefore')({ input, payload });

	let { _meta, ...output } = await item.Fn('execute', payload);

	if (item.Get('format') === 'json' && schema)
	{
		output = onetype.DataDefine(output, schema);
	}

	item.Get('onAfter') && await item.Get('onAfter')({ input, payload, output });

	output._meta = _meta;

	return output;
});
