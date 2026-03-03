import agents from '#agents/load.js';
import orchestrator from '#orchestrator/addon.js';

orchestrator.Fn('item.state.goal', async function(item, state)
{
    const payload = {
        task: state.task,
        agent: state.agents.find((item) => item.id === state.agent),
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

    const result = await agents.ItemGet('orchestrator-goal').Fn('run', payload);

    state.goal = result.goal;
    state.tokens.input += result._meta.tokens.input;
    state.tokens.output += result._meta.tokens.output;

    const onGoal = item.Get('onGoal');

    if(onGoal)
    {
        await onGoal({ state, output: result });
    }

    return result;
});
