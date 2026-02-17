const breadcrumb = divhunt.Addon('breadcrumb', (addon) =>
{
	addon.Field('id', ['string']);
	addon.Field('order', ['number', 0]);
	addon.Field('icon', ['string', '']);
	addon.Field('label', ['string', 'Page']);
	addon.Field('href', ['string', '#']);
	addon.Field('condition', ['boolean', true]);
});
