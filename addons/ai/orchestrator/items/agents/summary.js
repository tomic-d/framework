onetype.AddonReady('agents', (agents) =>
{
    agents.Item({
        id: 'orchestrator-summary',
        name: 'Orchestrator Summary',
        description: 'Final user-facing summary of all actions',
        instructions: `
            Summarize what was accomplished across all steps.
            Concrete results only. Mention failures if any. Max 40 words. Plain text.
        `,
        tokens: 200,
        input: {
            task: {
                type: 'string',
                description: 'The original user request'
            },
            history: {
                type: 'array',
                description: 'All steps [{step, agent, goal, conclusion}]'
            }
        },
        output: {
            summary: {
                type: 'string',
                description: 'Concise summary of all actions performed'
            }
        }
    });
});
