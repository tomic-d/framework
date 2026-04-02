import ai from '#ai/addon.js';

ai.agents.Fn('item.messages', function(item, data = {}, history = null)
{
	const state = onetype.StateGet();

	const instructions = item.Get('instructions');
	const input = item.Get('input');
	const output = typeof item.Get('output') === 'function' ? item.Get('output')({input}) : item.Get('output');
	const messages = [];

	const system = [
		instructions,
		state && Object.keys(state).length ? 'State:\n' + JSON.stringify(state, null, 2) : null,
		input && Object.keys(input).length ? 'Input fields:\n' + item.Fn('describe', input) : null,
		output && Object.keys(output).length && item.Get('format') === 'json' ? 'Output fields:\n' + item.Fn('describe', output) : null,
	].filter(Boolean).join('\n\n');

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

	if(data && Object.keys(data).length)
	{
		messages.push({role: 'user', content: JSON.stringify(data, null, 2)});
	}

	return messages;
});