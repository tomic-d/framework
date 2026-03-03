import onetype from 'onetype';
import agents from '#agents/load.js';
import orchestrator from '#orchestrator/addon.js';

orchestrator.Fn('item.state.input', async function(item, state)
{
    const agent = agents.ItemGet(state.agent);
    const schema = agent.Get('input');
    const fields = Object.keys(schema);

    if (fields.length === 0)
    {
        state.input = {};
        return;
    }

    const payload = {
        goal: state.goal,
        agent: {
            id: agent.Get('id'),
            description: agent.Get('description'),
            config: agent.Get('input')
        },
        fields: schema
    };

    const result = await agents.ItemGet('orchestrator-input').Fn('run', payload);

    const matched = {};

    for (const field of fields)
    {
        const value = result.values?.[field];

        if (value === undefined || value === null) continue;

        matched[field] = value;
    }

    /* Defaults */

    for (const field of fields)
    {
        if (matched[field] === undefined && schema[field]?.value !== undefined)
        {
            matched[field] = schema[field].value;
        }
    }

    state.input = onetype.DataDefine(matched, schema);
    state.tokens.input += result._meta.tokens.input;
    state.tokens.output += result._meta.tokens.output;

    return result;
});
