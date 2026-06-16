import ai from '#ai/addon.js';

ai.workflows.Fn('item.emit', function(item, name, data)
{
	const callback = item.Get(name);

	if (callback && typeof callback === 'function')
	{
		callback(data);
	}
});