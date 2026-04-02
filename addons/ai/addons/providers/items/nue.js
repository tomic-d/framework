import ai from '#ai/addon.js';

ai.providers.Item({
	id: 'nue',
	name: 'Nue Tools',
	default: false,
	endpoint: 'https://nue.tools.divhunt.com/api/run/ai-chat',
	key: 'NUE_API_KEY',
	model: 'qwen3.5-9b',
	models: {
		'qwen3.5-9b': {
			tokens: 8000
		}
	},
	onBeforeRequest: ({ payload, key }) =>
	{
		const body = {
			messages: payload.messages,
			tokens: payload.tokens || 2000,
			temperature: payload.temperature ?? 0.15,
			top_p: payload.top_p ?? 0.8,
			top_k: payload.top_k ?? 20,
			presence_penalty: payload.presence_penalty ?? 1.5,
			thinking: payload.thinking || false,
			stream: false,
			json_schema: payload.json_schema
		};

		return {
			headers: {
				'Content-Type': 'application/json',
				...(key && { 'Authorization': 'Bearer ' + key })
			},
			body
		};
	},
	onAfterRequest: ({ response }) =>
	{
		const data = response.data || {};
		const usage = data.usage || {};

		return {
			content: (data.response || '').trim(),
			reasoning: (data.thinking || '').trim() || null,
			tokens: {
				input: usage.prompt_tokens || 0,
				output: usage.completion_tokens || 0
			}
		};
	},
	onParse: (line) =>
	{
		const trimmed = line.trim();

		if (!trimmed)
		{
			return null;
		}

		try
		{
			return JSON.parse(trimmed).response || null;
		}
		catch (e)
		{
			return null;
		}
	}
});
