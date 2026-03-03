import agents from '#agents/load.js';
import orchestrator from '#orchestrator/addon.js';

orchestrator.Fn('item.state.done', async function(item, state)
{
    const agent = agents.ItemGet('orchestrator-done');

    const payload = { 
        task: state.task, 
        history: state.history.map((item) => 
        {
            return {
                step: item.step,
                agent: item.agent,
                goal: item.goal,
                conclusion: item.conclusion
            }
        }),
    };
    
    const result = await agent.Fn('run', payload);

    state.done = result.done;

    const actions = result.actions || [];
    const confirmed = actions.filter(a => a.confirmed).length;

    state.debug = { total: actions.length, confirmed, done: result.done, actions };
    state.tokens.input += result._meta.tokens.input;
    state.tokens.output += result._meta.tokens.output;

    const onDone = item.Get('onDone');

    if(onDone)
    {
        await onDone({ state, output: result });
    }

    return result;
});
