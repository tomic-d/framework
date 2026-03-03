onetype.AddonReady('agents', (agents) =>
{
    agents.Item({
        id: 'orchestrator-input',
        name: 'Orchestrator Input',
        description: 'Extracts input values from the goal text',
        instructions: `
            Extract literal values from the goal text for each field.
            Extract exactly as stated. Plain values only — no objects, no arrays.
            If the goal has no value for a field, omit it. Better to omit than guess.
        `,
        tokens: 300,
        input: {
            goal: {
                type: 'string',
                description: 'Goal text with concrete values to extract'
            },
            agent: {
                type: 'object',
                description: 'Target agent {id, description, config}'
            },
            fields: {
                type: 'object',
                description: 'Fields needing values {name → {type, description}}'
            }
        },
        output: {
            values: {
                type: 'object',
                description: 'Extracted values keyed by field name'
            }
        }
    });
});
