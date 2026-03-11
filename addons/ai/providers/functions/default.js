import providers from '#providers/addon.js';

providers.Fn('default', function()
{
	const items = Object.values(providers.Items());

	return items.find(p => p.Get('default')) || items[0] || null;
});
