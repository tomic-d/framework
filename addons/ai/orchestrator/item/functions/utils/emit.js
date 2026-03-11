import orchestrator from '#orchestrator/addon.js';

orchestrator.Fn('item.emit', function(item, name, data)
{
	const callback = item.Get(name);

	if (callback && typeof callback === 'function')
	{
		callback(data);
	}
});