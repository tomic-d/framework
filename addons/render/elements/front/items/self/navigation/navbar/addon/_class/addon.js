const navbar = divhunt.Addon('navbar', (addon) =>
{
	addon.Field('id', ['string']);
	addon.Field('position', ['string', 'right']);
	addon.Field('order', ['number', 0]);
	addon.Field('icon', ['string', '']);
	addon.Field('label', ['string', 'Menu Item']);
	addon.Field('href', ['string', '#']);
	addon.Field('variant', ['array', []]);
	addon.Field('size', ['string', '']);
	addon.Field('active', ['boolean', false]);
	addon.Field('condition', ['boolean', true]);
});
