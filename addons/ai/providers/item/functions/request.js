import providers from '#providers/addon.js';

providers.Fn('item.request', async function(provider, payload, stream = null)
{
	const key = (typeof process !== 'undefined' && process.env ? process.env[provider.Get('key')] : '') || '';
	const model = payload.model || provider.Get('model');
	const config = provider.Get('models')[model] || {};
	const before = provider.Get('onBeforeRequest')({ payload: { ...payload, model }, key, config });

	if (stream)
	{
		before.body.stream = true;
	}

	const endpoint = provider.Get('endpoint') + (stream ? (provider.Get('endpoint').includes('?') ? '&' : '?') + 'streaming=true' : '');
	const start = Date.now();
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), 120000);

	const response = await fetch(endpoint,
	{
		method: 'POST',
		headers: before.headers,
		body: JSON.stringify(before.body),
		signal: controller.signal
	});

	clearTimeout(timer);

	if (!response.ok)
	{
		throw new Error('API error: ' + response.status);
	}

	if (stream)
	{
		const reader = response.body.getReader();
		const decoder = new TextDecoder();
		const parse = provider.Get('onParse');
		let content = '';
		let buffer = '';
		let tokens = 0;

		while (true)
		{
			const { done, value } = await reader.read();

			if (done)
			{
				break;
			}

			buffer += decoder.decode(value, { stream: true });

			const lines = buffer.split('\n');
			buffer = lines.pop();

			for (const line of lines)
			{
				const token = parse(line);

				if (token)
				{
					content += token;
					tokens++;
					stream(token);
				}
			}
		}

		if (buffer.trim())
		{
			const token = parse(buffer);

			if (token)
			{
				content += token;
				tokens++;
				stream(token);
			}
		}

		const time = Date.now() - start;
		const input = Math.ceil(JSON.stringify(before.body).length / 4);
		const tps = time > 0 ? parseFloat((tokens / (time / 1000)).toFixed(2)) : 0;

		return {
			content,
			reasoning: null,
			tokens: { input, output: tokens },
			time,
			tps
		};
	}

	const raw = await response.json();
	const time = Date.now() - start;
	const after = provider.Get('onAfterRequest')({ response: raw, model, config });
	const tps = time > 0 ? parseFloat((after.tokens.output / (time / 1000)).toFixed(2)) : 0;

	return {
		content: after.content,
		reasoning: after.reasoning,
		tokens: after.tokens,
		time,
		tps
	};
});
