import ai from '#ai/addon.js';

ai.orchestrators.Fn('item.run', async function(item)
{
	const state = item.Fn('state');

	item.Set('status', 'running');
	item.Set('state', state);

	try
	{
		await item.Fn('modes.action', state);

		item.Set('status', 'completed');
		item.Fn('emit', 'onSuccess', { state });
	}
	catch (error)
	{
		item.Set('status', 'failed');
		item.Fn('emit', 'onFail', { error, state });

		throw error;
	}
	finally
	{
		return state;
	}
});