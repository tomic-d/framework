import onetype from '#framework/load.js';

const ai = onetype.Addon('ai', (ai) =>
{
	ai.agents = onetype.Addon('ai.agents', (addon) =>
	{
		addon.Field('id', {
			type: 'string',
			description: 'Unique agent id.'
		});

		addon.Field('name', {
			type: 'string',
			value: '',
			description: 'Human readable agent name.'
		});

		addon.Field('description', {
			type: 'string',
			value: '',
			description: 'What the agent does. The orchestrator picks agents by this.'
		});

		addon.Field('instructions', {
			type: 'string',
			value: '',
			description: 'System instructions for the model. Without instructions the agent never calls the model, only the onAfter hook runs, which makes it a plain tool.'
		});

		addon.Field('tokens', {
			type: 'number',
			value: 8000,
			description: 'Maximum tokens the model may generate.'
		});

		addon.Field('condition', {
			type: 'function',
			description: 'Returns whether the agent is currently available. Hidden from the orchestrator when falsy.'
		});

		addon.Field('temperature', {
			type: 'number',
			value: 0.15,
			description: 'Sampling temperature, lower is more deterministic.'
		});

		addon.Field('top_p', {
			type: 'number',
			value: 0.9,
			description: 'Nucleus sampling cutoff.'
		});

		addon.Field('top_k', {
			type: 'number',
			value: 20,
			description: 'Top k sampling cutoff.'
		});

		addon.Field('presence_penalty', {
			type: 'number',
			value: 1.5,
			description: 'Penalty for repeating tokens already present, 0 to 2. High by default, it breaks whitespace loops in constrained generation.'
		});

		addon.Field('format', {
			type: 'string',
			value: 'json',
			options: ['json', 'text'],
			description: 'json constrains the response to the output schema, text returns plain content.'
		});

		addon.Field('input', {
			type: 'object',
			value: {},
			description: 'Input schema in the data define format. Validated before the run.'
		});

		addon.Field('output', {
			type: 'object|function',
			value: {},
			description: 'Output schema in the data define format, or a function of the input that returns one. Validated after the run.'
		});

		addon.Field('onBefore', {
			type: 'function',
			description: 'Called with the input and the payload right before the model request.'
		});

		addon.Field('onAfter', {
			type: 'function',
			description: 'Called with the input, payload and output after the run. For agents without instructions this is the whole job.'
		});

		addon.Field('onSuccess', {
			type: 'function',
			description: 'Called after a successful run.'
		});

		addon.Field('onFail', {
			type: 'function',
			description: 'Called after a failed run.'
		});
	});

	ai.orchestrators = onetype.Addon('ai.orchestrators', (addon) =>
	{
		addon.Field('id', {
			type: 'string|number',
			description: 'Unique orchestrator id.'
		});

		addon.Field('parent', {
			type: 'string',
			description: 'Id of the parent orchestrator when this one runs as a loop child.'
		});

		addon.Field('prompt', {
			type: 'string',
			description: 'The goal the orchestrator plans and executes.'
		});

		addon.Field('agents', {
			type: 'array',
			value: [],
			each: { type: 'string' },
			description: 'Agent ids the orchestrator may use. Empty means every available agent.'
		});

		addon.Field('data', {
			type: 'object',
			value: {},
			description: 'Variables available to the plan through dollar references.'
		});

		addon.Field('status', {
			type: 'string',
			value: 'idle',
			options: ['idle', 'running', 'completed', 'failed'],
			description: 'Current run status.'
		});

		addon.Field('state', {
			type: 'object',
			value: null,
			description: 'Run state with the plan, agents and token usage. Set by the run.'
		});

		addon.Field('history', {
			type: 'array',
			value: [],
			each: { type: 'object' },
			description: 'Conversation history of the run, role and content entries.'
		});

		addon.Field('steps', {
			type: 'number',
			value: 10,
			description: 'Maximum steps the orchestrator may execute.'
		});

		addon.Field('onTasks', {
			type: 'function',
			value: null,
			description: 'Called when tasks are derived from the goal.'
		});

		addon.Field('onStep', {
			type: 'function',
			value: null,
			description: 'Called after the plan and after every executed step.'
		});

		addon.Field('onSummary', {
			type: 'function',
			value: null,
			description: 'Called with the closing summary of the run.'
		});

		addon.Field('onSuccess', {
			type: 'function',
			value: null,
			description: 'Called after the whole run completes.'
		});

		addon.Field('onFail', {
			type: 'function',
			value: null,
			description: 'Called when the run fails or the goal is not achievable.'
		});
	});
});

export default ai;
