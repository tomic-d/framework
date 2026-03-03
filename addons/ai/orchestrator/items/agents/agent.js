onetype.AddonReady('agents', (agents) =>
{
    agents.Item({
        id: 'orchestrator-agent',
        name: 'Orchestrator Agent',
        description: 'Selects the next agent and writes its goal',
        instructions: `
            Pick the next agent and write its goal.

            Read conclusions to know what is done. If data is missing, pick a listing agent first.
            If data exists, pick the action agent. Complete remaining items of the same type before moving on.
            Agent ID must exactly match one from the agents list.

            Goal: one action, one target. Include concrete values from conclusions. Never guess.
        `,
        tokens: 400,
        input: {
            task: {
                type: 'string',
                description: 'The original user request'
            },
            history: {
                type: 'array',
                description: 'Completed steps [{step, agent, goal, conclusion}]'
            },
            agents: {
                type: 'array',
                description: 'Available agents [{id, description, config}]'
            }
        },
        output: {
            agent: {
                type: 'string',
                description: 'Exact agent ID from the agents list'
            },
            reason: {
                type: 'string',
                description: 'One sentence: why this agent now'
            },
            goal: {
                type: 'string',
                description: 'Actionable goal with literal values for the agent'
            }
        }
    });
});
