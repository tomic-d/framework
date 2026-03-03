import agents from '#agents/load.js';
import orchestrator from '#orchestrator/addon.js';

orchestrator.Fn('item.state.execute', async function(item, state)
{
    const result = await agents.ItemGet(state.agent).Fn('run', state.input);

    const { _meta, ...output } = result;

    state.output = output;

    state.tokens.input += result._meta.tokens.input;
    state.tokens.output += result._meta.tokens.output;

    return result;
});
