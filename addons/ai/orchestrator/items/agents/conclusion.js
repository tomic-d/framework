onetype.AddonReady('agents', (agents) =>
{
    agents.Item({
        id: 'orchestrator-conclusion',
        name: 'Orchestrator Conclusion',
        description: 'Records what happened — the only memory future steps can read',
        instructions: `
            You are the orchestrator's memory. Future steps ONLY read your conclusion.
            Omitted data is lost forever.

            Single dense paragraph. Include every field and value from the output.
            ALL items if the output is a list. Preserve data relevant to the task and goal.
            Past tense. Max 60 words.
        `,
        tokens: 300,
        input: {
            task: {
                type: 'string',
                description: 'The original user request'
            },
            goal: {
                type: 'string',
                description: 'What this step was trying to do'
            },
            agent: {
                type: 'object',
                description: 'Agent that ran {id, description, config}'
            },
            output: {
                type: 'object',
                description: 'Raw output from the agent'
            }
        },
        output: {
            conclusion: {
                type: 'string',
                description: 'Dense conclusion with all IDs'
            }
        }
    });
});
