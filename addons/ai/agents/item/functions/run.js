import onetype from 'onetype';
import agents from '#agents/addon.js';
import providers from '#providers/addon.js';

agents.Fn('item.run', async function(agent, data = {})
{
    this.methods.schema = (agent) =>
    {
        const schema = {};

        for (const [key, value] of Object.entries(agent.Get('output')))
        {
            if (value.populate !== false)
            {
                schema[key] = value;
            }
        }

        return schema;
    };

    this.methods.system = (agent) =>
    {
        return agent.Get('instructions');
    };

    this.methods.context = (agent, data) =>
    {
        const context = agent.Get('context');

        if (typeof context === 'function')
        {
            return context({ data });
        }

        return context;
    };

    this.methods.content = async (agent, data) =>
    {
        let content = '';

        const context = await this.methods.context(agent, data);

        if (context && Object.keys(context).length > 0)
        {
            content += JSON.stringify(context, null, 2) + '\n\n';
        }

        if (Object.keys(data).length > 0)
        {
            content += JSON.stringify(data, null, 2);
        }

        return content.trim();
    };

    this.methods.output = (schema) =>
    {
        const keys = Object.keys(schema);

        if (keys.length === 0)
        {
            return 'Respond with a JSON object.';
        }

        let text = 'Respond with a single-line JSON object containing:\n';

        for (const [key, field] of Object.entries(schema))
        {
            const type = field.type || 'string';
            const required = field.required === false ? 'optional' : 'required';
            const description = field.description || '';

            text += `- "${key}" (${type}, ${required})${description ? ': ' + description : ''}\n`;
        }

        return text.trim();
    };

    this.methods.example = (schema) =>
    {
        const example = {};

        for (const [key, field] of Object.entries(schema))
        {
            const type = field.type || 'string';

            if (type === 'number')
            {
                example[key] = 0;
            }
            else if (type === 'boolean')
            {
                example[key] = false;
            }
            else if (type === 'array')
            {
                example[key] = [];
            }
            else if (type === 'object')
            {
                example[key] = {};
            }
            else
            {
                example[key] = '';
            }
        }

        return JSON.stringify(example);
    };

    this.methods.format = () =>
    {
        return { type: 'json_object' };
    };

    this.methods.payload = async (agent, data) =>
    {
        const schema = this.methods.schema(agent);
        const system = this.methods.system(agent);
        const content = await this.methods.content(agent, data);
        const output = this.methods.output(schema);
        const example = this.methods.example(schema);
        const format = this.methods.format(agent, schema);

        const messages = [
            { role: 'system', content: system },
            { role: 'assistant', content: 'What data do you have?' },
            { role: 'user', content: content },
            { role: 'assistant', content: 'How should I format my response?' },
            { role: 'user', content: output + '\n\nExample: ' + example }
        ];

        return {
            model: agent.Get('model'),
            messages,
            max_tokens: agent.Get('tokens') || 1000,
            temperature: 0.7,
            top_p: 0.8,
            top_k: 20,
            presence_penalty: 1.5,
            response_format: format
        };
    };

    this.methods.validate = (data, schema, type) =>
    {
        if (Object.keys(schema).length === 0)
        {
            return data;
        }

        try
        {
            return onetype.DataDefine(data, schema);
        }
        catch (error)
        {
            throw new Error(`Agent ${type} Error: ${error.message}`);
        }
    };

    const validated = this.methods.validate(data, agent.Get('input'), 'Input');
    const payload = await this.methods.payload(agent, validated);

    const providerId = agent.Get('provider');
    const provider = providerId ? providers.ItemGet(providerId) : providers.Fn('default');

    if (!provider)
    {
        throw new Error(`Provider not found: ${providerId || 'default'}`);
    }

    try
    {
        agent.Get('onRun') && await agent.Get('onRun')({ payload });

        const result = await provider.Fn('request', payload);
        let parsed = agents.Fn('parse', result.content);

        if (agent.Get('callback'))
        {
            await agent.Get('callback')({ input: validated, output: parsed });
            parsed = this.methods.validate(parsed, agent.Get('output'), 'Output Post-Callback');
        }
        else
        {
            parsed = this.methods.validate(parsed, agent.Get('output'), 'Output');
        }

        const missing = Object.keys(agent.Get('output')).filter(k => agent.Get('output')[k].populate !== false && parsed[k] === undefined);

        if (missing.length > 0)
        {
            throw new Error(`Missing output fields: ${missing.join(', ')}`);
        }

        const meta = {
            time: result.time,
            tokens: result.tokens,
            tps: result.tps,
            reasoning: result.reasoning
        };

        agent.Get('onSuccess') && await agent.Get('onSuccess')({ payload, parsed, meta });

        parsed._meta = meta;

        return parsed;
    }
    catch (error)
    {
        agent.Get('onFail') && await agent.Get('onFail')({ payload, error });
        throw error;
    }
});
