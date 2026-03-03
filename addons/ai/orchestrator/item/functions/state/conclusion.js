import agents from '#agents/load.js';
import orchestrator from '#orchestrator/addon.js';

orchestrator.Fn('item.state.conclusion', async function(item, state)
{
    const payload = {
        task: state.task,
        goal: state.goal,
        agent: state.agents.find((entry) => entry.id === state.agent),
        output: state.output
    };

    const result = await agents.ItemGet('orchestrator-conclusion').Fn('run', payload);

    state.conclusion = result.conclusion;
    state.tokens.input += result._meta.tokens.input;
    state.tokens.output += result._meta.tokens.output;

    const onConclusion = item.Get('onConclusion');

    if(onConclusion)
    {
        await onConclusion({ state, output: result });
    }

    return result;
});
