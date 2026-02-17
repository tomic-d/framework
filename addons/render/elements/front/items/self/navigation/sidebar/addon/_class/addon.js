const sidebar = divhunt.Addon('sidebar', (addon) =>
{
	addon.Field('id', ['string|number']);
	addon.Field('type', ['string', 'item']);
	addon.Field('group', ['string', '']);
	addon.Field('order', ['number', 0]);
	addon.Field('icon', ['string', 'folder']);
	addon.Field('label', ['string', 'Menu Item']);
	addon.Field('href', ['string', '#']);
	addon.Field('active', ['boolean', false]);
	addon.Field('condition', ['boolean', true]);
});
