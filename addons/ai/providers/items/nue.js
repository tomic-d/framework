onetype.AddonReady('providers', (providers) =>
{
    providers.Item({
        id: 'nue',
        name: 'Nue Tools',
        default: true,
        endpoint: 'https://nue.tools.divhunt.com/api/run/ai-chat',
        key: 'NUE_API_KEY',
        model: 'qwen3-next-80b-a3b-thinking',
        models: {
            'qwen3-next-80b-a3b-thinking': {
                tokens: 32768,
                thinking: true,
                price: { input: 0, output: 0 }
            }
        },
        onBeforeRequest: ({ payload, key }) =>
        ({
            headers: {
                'Content-Type': 'application/json',
                ...(key && { 'Authorization': `Bearer ${key}` })
            },
            body: payload
        }),
        onAfterRequest: ({ response }) =>
        {
            const data = response.data || {};
            let text = (data.response || '').trim();

            let reasoning = (data.reasoning || '').trim() || null;

            if (!reasoning)
            {
                const match = text.match(/<think>([\s\S]*?)<\/think>/i);

                if (match)
                {
                    reasoning = match[1].trim();
                    text = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
                }
                else if (text.includes('<think>'))
                {
                    /* Handle unclosed think tag */
                    const idx = text.indexOf('<think>');
                    reasoning = text.slice(idx + 7).trim();
                    text = text.slice(0, idx).trim();
                }
            }

            const usage = data.usage || {};

            return {
                content: text,
                reasoning,
                tokens: {
                    input: usage.prompt_tokens || 0,
                    output: usage.completion_tokens || 0
                }
            };
        }
    });

    providers.Item({
        id: 'ollama',
        name: 'Ollama',
        default: false,
        endpoint: 'http://localhost:11434/v1/chat/completions',
        model: 'qwen3-coder-next:cloud',
        models: {
            'qwen3-coder-next:cloud': {
                tokens: 32768,
                price: { input: 0, output: 0 }
            }
        },
        onBeforeRequest: ({ payload }) =>
        ({
            headers: {
                'Content-Type': 'application/json'
            },
            body: payload
        }),
        onAfterRequest: ({ response }) =>
        {
            const choice = response.choices?.[0] || {};
            const text = (choice.message?.content || '').trim();
            const usage = response.usage || {};

            return {
                content: text,
                reasoning: null,
                tokens: {
                    input: usage.prompt_tokens || 0,
                    output: usage.completion_tokens || 0
                }
            };
        }
    });
});
