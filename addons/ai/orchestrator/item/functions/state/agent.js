import onetype from 'onetype';
import agents from '#agents/load.js';
import orchestrator from '#orchestrator/addon.js';

orchestrator.Fn('item.state.agent', async function(item, state)
{
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
        agents: state.agents
    };

    const result = await agents.ItemGet('orchestrator-agent').Fn('run', payload);

    if (!state.agents.find((a) => a.id === result.agent))
    {
        throw onetype.Error(422, `Agent "${result.agent}" not found in available agents`);
    }

    state.agent = result.agent;
    state.goal = result.goal;
    state.tokens.input += result._meta.tokens.input;
    state.tokens.output += result._meta.tokens.output;

    const onAgent = item.Get('onAgent');

    if(onAgent)
    {
        await onAgent({ state, output: result });
    }

    return result;
});
