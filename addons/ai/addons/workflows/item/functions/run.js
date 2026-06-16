import ai from '#ai/addon.js';

ai.workflows.Fn('item.run', async function(item)
{
	const state = item.Fn('state');

	item.Set('status', 'running');
	item.Set('state', state);

	onetype.Emit('workflows.start', { id: item.Get('id'), prompt: item.Get('prompt') });

	try
	{
		const achieved = await item.Fn('modes.action', state);

		item.Set('status', achieved ? 'completed' : 'failed');

		onetype.Emit('workflows.done', { id: item.Get('id'), status: item.Get('status'), summary: state.summary });

		item.Fn('emit', achieved ? 'onSuccess' : 'onFail', { state });

		return state;
	}
	catch (error)
	{
		item.Set('status', 'failed');

		onetype.Emit('workflows.done', { id: item.Get('id'), status: 'failed', summary: error.message });

		item.Fn('emit', 'onFail', { error, state });

		throw error;
	}
});
