import ai from '#ai/addon.js';

ai.orchestrators.Fn('item.history', function(item, role, content)
{
	const history = item.Get('history');
	history.push({ role, content });
	item.Set('history', history);
});
