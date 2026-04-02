import ai from '#ai/addon.js';

ai.providers.Item({
	id: 'ollama',
	name: 'Ollama',
	default: true,
	endpoint: 'http://localhost:11434/api/chat',
	model: 'devstral-small-2:24b-cloud',
	models: {
		'devstral-small-2:24b-cloud': {
			tokens: 32000
		}
	},
	onBeforeRequest: ({ payload, key }) =>
	{
		const messages = payload.messages.map(m => ({
			role: m.role,
			content: m.content
		}));

		if(payload.json_schema)
		{
			messages[messages.length - 1].content += '\n\nRespond with valid JSON matching this schema:\n' + JSON.stringify(payload.json_schema);
		}

		return {
			headers: {
				'Content-Type': 'application/json'
			},
			body: {
				model: payload.model || 'devstral-small-2:24b-cloud',
				messages,
				stream: false,
				options: {
					temperature: payload.temperature ?? 0.15,
					top_p: payload.top_p ?? 0.9,
					top_k: payload.top_k ?? 20,
					num_predict: payload.tokens || 2000
				},
				format: payload.json_schema ? 'json' : undefined
			}
		};
	},
	onAfterRequest: ({ response }) =>
	{
		const message = response.message || {};
		let content = (message.content || '').trim();

		if(content.includes('```json'))
		{
			content = content.split('```json')[1].split('```')[0].trim();
		}
		else if(content.includes('```'))
		{
			content = content.split('```')[1].split('```')[0].trim();
		}

		return {
			content,
			reasoning: null,
			tokens: {
				input: response.prompt_eval_count || 0,
				output: response.eval_count || 0
			}
		};
	},
	onParse: (line) =>
	{
		try
		{
			const data = JSON.parse(line);
			return data.message?.content || null;
		}
		catch(e)
		{
			return null;
		}
	}
});
