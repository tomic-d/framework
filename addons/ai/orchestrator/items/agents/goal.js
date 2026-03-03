onetype.AddonReady('agents', (agents) =>
{
    agents.Item({
        id: 'orchestrator-goal',
        name: 'Orchestrator Goal',
        description: 'Writes a specific goal for the next agent to execute',
        instructions: `
            Write a goal for the selected agent.

            You receive:
            - task: the original user request
            - agent: the selected agent {id, description}
            - history: completed steps [{step, agent, goal, conclusion}]

            The goal is the ONLY instruction the agent receives.
            It is also used to extract literal input values for the agent.

            CRITICAL — ONE ACTION, ONE TARGET:
            - The agent executes ONCE — one API call, one item
            - If the task requires deleting 3 pages, the goal is for ONE page only
            - Read the agent description to know what ONE call can do
            - Never list multiple IDs or targets in a single goal

            CRITICAL — RESOLVE ALL REFERENCES:
            - Conclusions contain exact values from previous steps — USE THEM
            - When the task references something by name, find its EXACT identifier in conclusions
            - When the task uses relative references (first, last, second), resolve to ACTUAL values from conclusions
            - NEVER guess or assume any value — only use what conclusions explicitly state
            - If the value you need is NOT in any conclusion, the goal must describe what to look up

            RULES:
            - Max 80 words
            - Include every concrete value the agent needs to execute
            - Plain text only, no markdown
        `,
        tokens: 400,
        input: {
            task: {
                type: 'string',
                description: 'The full original user request, used to know what the agent should work toward'
            },
            agent: {
                type: 'object',
                description: 'The selected agent that will execute this goal, with {id, description, config}'
            },
            history: {
                type: 'array',
                description: 'Chronological list of completed steps, each with {step, agent, goal, conclusion} — use conclusions to resolve concrete values'
            }
        },
        output: {
            goal: {
                type: 'string',
                description: 'A single actionable goal with all literal values the agent needs to execute'
            }
        }
    });
});
