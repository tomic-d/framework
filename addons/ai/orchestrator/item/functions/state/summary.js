import agents from '#agents/load.js';
import orchestrator from '#orchestrator/addon.js';

orchestrator.Fn('item.state.summary', async function(item, state)
{
    const payload = {
        task: state.task,
        history: state.history.map((entry) =>
        {
            return {
                step: entry.step,
                agent: entry.agent,
                goal: entry.goal,
                conclusion: entry.conclusion
            }
        })
    };

    const result = await agents.ItemGet('orchestrator-summary').Fn('run', payload);

    state.summary = result.summary;
    state.tokens.input += result._meta.tokens.input;
    state.tokens.output += result._meta.tokens.output;
    
    return result;
});
