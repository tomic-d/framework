import ai from '#ai/addon.js';

ai.agents.Fn('item.run', async function(item, input = {}, history = null)
{
	this.methods.tool = async () =>
	{
		const output = {};

		item.Get('onAfter') && await item.Get('onAfter')({ input, output, payload: {} });

		return { content: output, meta: { time: '0.00', tokens: { input: 0, output: 0 } } };
	};

	this.methods.payload = (schema) =>
	{
		const state = typeof item.Get('state') === 'function' ? item.Get('state')({ input }) : item.Get('state');
		const messages = this.Fn('messages', item.Get('instructions'), item.Get('input'), schema, item.Get('format'), state, history);

		if (Object.keys(input).length)
		{
			messages.push({ role: 'user', content: JSON.stringify(input, null, 2) });
		}

		/* The model server rejects conversations without a user turn. */

		if (!messages.some((message) => message.role === 'user'))
		{
			messages.push({ role: 'user', content: 'Proceed.' });
		}

		const payload = {
			tokens: item.Get('tokens'),
			messages,
			temperature: item.Get('temperature'),
			top_p: item.Get('top_p'),
			top_k: item.Get('top_k'),
			presence_penalty: item.Get('presence_penalty')
		};

		if (item.Get('format') === 'json')
		{
			payload.schema = this.Fn('schema', schema);
		}

		return payload;
	};

	this.methods.execute = async (payload) =>
	{
		const result = await onetype.PipelineRun('ai:agents:request', payload);

		if (result.code !== 200)
		{
			throw onetype.Error(result.code, result.message);
		}

		const meta = {
			time: result.time,
			tokens: result.data.usage
		};

		if (item.Get('format') === 'text')
		{
			return { content: result.data.content, meta };
		}

		try
		{
			return { content: JSON.parse(result.data.content), meta };
		}
		catch (error)
		{
			throw onetype.Error(500, 'Agent response is not valid JSON: ' + result.data.content.slice(0, 200));
		}
	};

	input = item.Get('input') ? onetype.DataDefine(input, item.Get('input'), true) : {};

	if (!item.Get('instructions'))
	{
		return this.methods.tool();
	}

	const schema = typeof item.Get('output') === 'function' ? item.Get('output')({ input }) : item.Get('output');
	const payload = this.methods.payload(schema);

	item.Get('onBefore') && item.Get('onBefore')({ input, payload });

	let { content, meta } = await this.methods.execute(payload);

	if (item.Get('format') === 'json' && schema)
	{
		content = onetype.DataDefine(content, schema);
	}

	item.Get('onAfter') && await item.Get('onAfter')({ input, payload, output: content });

	return { content, meta };
});
