import onetype from '#framework/load.js';

onetype.Pipeline('ai:agents:request', {
	description: 'Send a chat request to an OpenAI compatible endpoint and return the model output. Join to swap the endpoint, reshape the body or intercept the response.',
	metadata: { addon: 'ai.agents' },
	in: {
		endpoint: {
			type: 'string',
			value: 'http://192.168.1.3:8000/v1/chat/completions',
			description: 'OpenAI compatible chat completions endpoint to send the request to.'
		},
		model: {
			type: 'string',
			value: 'qwen3.5',
			description: 'Model name as the server knows it.'
		},
		messages: {
			type: 'array',
			required: true,
			each: {
				type: 'object',
				config: {
					role: {
						type: 'string',
						required: true,
						description: 'Message author, one of system, user, assistant or tool.'
					},
					content: {
						type: 'string',
						required: true,
						description: 'Message text.'
					}
				}
			},
			description: 'Conversation messages in order.'
		},
		schema: {
			type: 'object',
			value: null,
			description: 'JSON schema for structured output. The server hard constrains the response to it. Null means plain text.'
		},
		tokens: {
			type: 'number',
			value: 2000,
			description: 'Maximum tokens the model may generate.'
		},
		temperature: {
			type: 'number',
			value: 0.15,
			description: 'Sampling temperature, lower is more deterministic.'
		},
		top_p: {
			type: 'number',
			value: 0.9,
			description: 'Nucleus sampling cutoff.'
		},
		top_k: {
			type: 'number',
			value: 20,
			description: 'Top k sampling cutoff.'
		},
		presence_penalty: {
			type: 'number',
			value: 1.5,
			description: 'Penalty for repeating tokens already present, 0 to 2. High by default, it breaks whitespace loops in constrained generation.'
		},
		think: {
			type: 'boolean',
			value: false,
			description: 'Whether the model may reason before answering. Off by default for speed, works together with schema.'
		},
		timeout: {
			type: 'number',
			value: 120000,
			description: 'Request timeout in milliseconds.'
		}
	},
	out: {
		content: {
			type: 'string',
			description: 'Model output text, code fences stripped.'
		},
		usage: {
			type: 'object',
			config: {
				input: {
					type: 'number',
					description: 'Prompt tokens the request consumed.'
				},
				output: {
					type: 'number',
					description: 'Tokens the model generated.'
				}
			},
			description: 'Token usage of the request.'
		}
	}
})
.Join('prepare', 10, {
	description: 'Shape the OpenAI compatible request body from the input.',
	out: {
		body: {
			type: 'object',
			description: 'Request body ready to send.'
		}
	},
	callback: function(properties)
	{
		const body = {
			model: properties.model || 'qwen3.5',
			messages: properties.messages,
			stream: false,
			max_tokens: properties.tokens,
			temperature: properties.temperature,
			top_p: properties.top_p,
			top_k: properties.top_k,
			presence_penalty: properties.presence_penalty,
			chat_template_kwargs: {
				enable_thinking: properties.think
			}
		};

		if(properties.schema)
		{
			body.response_format = {
				type: 'json_schema',
				json_schema: {
					name: 'output',
					strict: true,
					schema: properties.schema
				}
			};
		}

		return { body };
	}
})
.Join('request', 20, {
	description: 'Send the request and read the raw response.',
	requires: ['body'],
	out: {
		response: {
			type: 'object',
			description: 'Raw chat completions response.'
		}
	},
	callback: async function(properties, resolve)
	{
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), properties.timeout);

		try
		{
			const response = await fetch(properties.endpoint, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(properties.body),
				signal: controller.signal
			});

			if(!response.ok)
			{
				return resolve(null, 'Model server responded with status ' + response.status + '.', 502);
			}

			return { response: await response.json() };
		}
		catch(error)
		{
			return resolve(null, 'Model request failed: ' + error.message, 502);
		}
		finally
		{
			clearTimeout(timer);
		}
	}
})
.Join('parse', 30, {
	description: 'Pull the output text and token usage out of the response.',
	requires: ['response'],
	out: {
		content: {
			type: 'string',
			description: 'Model output text, code fences stripped.'
		},
		usage: {
			type: 'object',
			description: 'Token usage of the request.'
		}
	},
	callback: function(properties, resolve)
	{
		const choice = (properties.response.choices || [])[0];

		if(!choice)
		{
			return resolve(null, 'Model response holds no choices.', 502);
		}

		if(choice.finish_reason === 'length')
		{
			return resolve(null, 'Model ran out of tokens before finishing the response.', 502);
		}

		let content = (choice.message.content || '').trim();

		if(content.includes('```json'))
		{
			content = content.split('```json')[1].split('```')[0].trim();
		}
		else if(content.includes('```'))
		{
			content = content.split('```')[1].split('```')[0].trim();
		}

		const usage = properties.response.usage || {};

		return {
			content,
			usage: {
				input: usage.prompt_tokens || 0,
				output: usage.completion_tokens || 0
			}
		};
	}
});
