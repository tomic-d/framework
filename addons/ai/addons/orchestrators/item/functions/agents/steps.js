import ai from '#ai/addon.js';

ai.orchestrators.Fn('item.agents.steps', async function(item, state, prompt, data)
{
	const payload = {
		prompt: prompt,
		agents: state.agents,
		data: data,
		pipelines: []
	};

	const result = await ai.agents.ItemGet('orchestrator-steps').Fn('run', payload, item.Get('history'));

	state.tokens.input += result._meta.tokens.input;
	state.tokens.output += result._meta.tokens.output;

	return { 
		reasoning: result.reasoning, 
		achievable: result.achievable, 
		steps: result.steps, 
		conclusion: result.conclusion 
	};
});
