import orchestrator from '#orchestrator/addon.js';

orchestrator.Fn('item.history', function(item, role, content, agent)
{
	const history = item.Get('history');
	history.push({ role, content, agent: agent || null });
	item.Set('history', history);
});
