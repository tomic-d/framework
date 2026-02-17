const tabs = divhunt.Addon('tabs', (addon) =>
{
	addon.Field('id', ['string|number']);
	addon.Field('order', ['number', 0]);
	addon.Field('label', ['string']);
	addon.Field('icon', ['string']);
	addon.Field('badge', ['string|number']);
	addon.Field('active', ['boolean', false]);
	addon.Field('disabled', ['boolean', false]);
	addon.Field('condition', ['function']);
});

tabs.Fn('get', function()
{
	let result = Object.values(this.Items());

	result = result.filter(item =>
	{
		return !item.Get('condition') || item.Get('condition')(item);
	});

	result = result.sort((a, b) => a.Get('order') - b.Get('order'));

	return result.map(item => ({
		id: item.Get('id'),
		label: item.Get('label'),
		icon: item.Get('icon'),
		badge: item.Get('badge'),
		active: item.Get('active'),
		disabled: item.Get('disabled')
	}));
});
