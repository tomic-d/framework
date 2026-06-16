import ai from '#ai/addon.js';

ai.agents.Fn('messages', function(instructions, input, output, format, state, history)
{
	const messages = [];

	const system = [
		instructions,
		input && Object.keys(input).length ? 'Input fields:\n' + this.Fn('describe', input) : null,
		output && Object.keys(output).length && format === 'json' ? 'Output fields:\n' + this.Fn('describe', output) : null,
		state && Object.keys(state).length ? 'Current state:\n' + JSON.stringify(state, null, 2) : null,
	]
	.filter(Boolean).join('\n\n');

	if(system)
	{
		messages.push({role: 'system', content: system});
	}

	if(Array.isArray(history) && history.length)
	{
		for(const entry of history)
		{
			messages.push({role: entry.role, content: entry.content});
		}
	}

	return messages;
});
