import onetype from 'onetype';
import orchestrator from '#orchestrator/addon.js';
import agents from '#agents/addon.js';

const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const cyan = (s) => `\x1b[36m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const magenta = (s) => `\x1b[35m${s}\x1b[0m`;

orchestrator.Fn('item.run', async function(item)
{
    const state = {
        data: item.Get('data'),
        task: item.Get('task'),
        agents: item.Get('agents').map((agent) =>
        {
            agent = agents.ItemGet(agent);

            if(!agent)
            {
                return false;
            }

            return {
                id: agent.Get('id'),
                description: agent.Get('description'),
                config: agent.Get('input')
            }
        }).filter(Boolean),

        stop: false,
        done: false,
        agent: null,
        goal: null,
        input: {},
        output: {},
        conclusion: null,
        summary: null,
        history: [],

        steps: { count: 0, total: item.Get('steps') },
        tokens: { input: 0, output: 0 }
    };

    const prev = { input: 0, output: 0 };

    const tks = () =>
    {
        const input = state.tokens.input - prev.input;
        const output = state.tokens.output - prev.output;

        prev.input = state.tokens.input;
        prev.output = state.tokens.output;

        return dim(`[${input}in/${output}out]`);
    };

    const truncate = (s, max = 120) => s.length > max ? s.slice(0, max) + '…' : s;

    console.log('');
    console.log(bold('ORCHESTRATOR') + dim(` — ${state.task}`));
    console.log(dim(`agents: ${state.agents.map(a => a.id).join(', ')}`));
    console.log(dim(`max steps: ${state.steps.total}`));
    console.log('');

    item.Set('status', 'running');
    item.Set('state', state);

    const start = Date.now();

    try
    {
        while (state.steps.count < state.steps.total)
        {
            if (state.history.length > 0)
            {
                await item.Fn('state.done', state);

                const { actions } = state.debug;
                const pending = actions.filter(a => !a.confirmed).map(a => a.action);
                const info = dim(` — ${state.debug.confirmed}/${state.debug.total}`) + (pending.length ? dim(` pending: ${pending.join(', ')}`) : '');

                if (state.done)
                {
                    console.log(green('  done') + info + ` ${tks()}`);
                    break;
                }

                console.log(dim('  done') + info + ` ${tks()}`);
            }

            if(state.stop)
            {
                const onStop = item.Get('onStop');

                if(onStop)
                {
                    await onStop({ state });
                }

                break;
            }

            state.steps.count++;

            console.log(bold(cyan(`STEP ${state.steps.count}/${state.steps.total}`)));

            /* Agent + Goal */

            await item.Fn('state.agent', state);
            console.log(yellow('  agent') + dim(` — ${state.agent}`) + ` ${tks()}`);
            console.log(dim(`  goal  — ${state.goal}`));

            /* Input */

            await item.Fn('state.input', state);

            const fields = Object.keys(state.input);

            if (fields.length > 0)
            {
                const pairs = fields.map(k => `${k}: ${JSON.stringify(state.input[k])}`).join(', ');
                console.log(magenta('  input') + dim(` — ${pairs}`) + ` ${tks()}`);
            }
            else
            {
                console.log(dim('  input — (none)') + ` ${tks()}`);
            }

            /* Execute */

            await item.Fn('state.execute', state);

            const keys = Object.keys(state.output);
            const preview = keys.map(k =>
            {
                const v = JSON.stringify(state.output[k]);
                return `${k}: ${v.length > 60 ? v.slice(0, 60) + '…' : v}`;
            }).join(', ');

            console.log(cyan('  exec ') + dim(` — ${truncate(preview, 200)}`) + ` ${tks()}`);

            /* Conclusion */

            await item.Fn('state.conclusion', state);
            console.log(green('  concl') + dim(` — ${state.conclusion}`) + ` ${tks()}`);

            state.history.push({
                agent: state.agent,
                step: state.steps.count,
                goal: state.goal,
                input: { ...state.input },
                output: { ...state.output },
                conclusion: state.conclusion
            });

            const onStep = item.Get('onStep');

            if(onStep)
            {
                await onStep({ state });
            }

            console.log('');
        }

        if(state.stop)
        {
            item.Set('status', 'stopped');

            return state;
        }

        if(!state.done)
        {
            throw onetype.Error(422, `Max steps (${state.steps.total}) reached without completing task`, {state});
        }

        /* Summary */

        await item.Fn('state.summary', state);

        const elapsed = ((Date.now() - start) / 1000).toFixed(1);

        console.log('');
        console.log(bold(green('COMPLETE')) + dim(` — ${state.steps.count} steps, ${elapsed}s`));
        console.log(dim(`tokens: ${state.tokens.input}in / ${state.tokens.output}out`));
        console.log(green('summary') + dim(` — ${state.summary}`));
        console.log('');

        item.Set('status', 'completed');

        const onSuccess = item.Get('onSuccess');

        if(onSuccess)
        {
            await onSuccess({ state });
        }

        return state;
    }
    catch (error)
    {
        const elapsed = ((Date.now() - start) / 1000).toFixed(1);

        console.log('');
        console.log(bold(red('FAILED')) + dim(` — step ${state.steps.count}, ${elapsed}s`));
        console.log(red(error.message));
        console.log('');

        item.Set('status', 'failed');

        const onFail = item.Get('onFail');

        if(onFail)
        {
            await onFail({ state, error });
        }

        throw error;
    }
});
