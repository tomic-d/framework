onetype.AddonReady('agents', (agents) =>
{
    agents.Item({
        id: 'orchestrator-done',
        name: 'Orchestrator Done',
        description: 'Checks if the orchestration task has been achieved',
        instructions: `
            Determine if the task is fully complete.

            Parse the task into distinct required actions. Only count mutating actions
            (create, update, delete, add, remove, publish, etc). Listings are not actions.

            For each action, check if a conclusion confirms it succeeded.
            Scope expands when conclusions reveal multiple items to process.

            done = true ONLY when every required action has a confirming conclusion.
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
            }
        },
        output: {
            actions: {
                type: 'array',
                description: 'Each required action with its status [{action, confirmed}]'
            },
            done: {
                type: 'boolean',
                description: 'true when every action is confirmed'
            }
        }
    });
});
