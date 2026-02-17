const footer = divhunt.Addon('footer', (addon) =>
{
	addon.Field('id', ['string']);
	addon.Field('type', ['string', 'link']);
	addon.Field('group', ['string', '']);
	addon.Field('order', ['number', 0]);
	addon.Field('icon', ['string', '']);
	addon.Field('label', ['string', 'Link']);
	addon.Field('href', ['string', '#']);
	addon.Field('condition', ['boolean', true]);
});
