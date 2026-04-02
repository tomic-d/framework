import ai from '#ai/addon.js';

ai.providers.Fn('default', function()
{
	const items = Object.values(ai.providers.Items());

	return items.find(p => p.Get('default')) || items[0] || null;
});
