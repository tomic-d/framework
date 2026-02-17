const transforms = divhunt.Addon('transforms', (addon) =>
{
    addon.Field('id', ['string']);
    addon.Field('icon', ['string', 'sync_alt']);
    addon.Field('name', ['string', '']);
    addon.Field('description', ['string', '']);
    addon.Field('js', ['array', []]);
    addon.Field('css', ['array', []]);
    addon.Field('config', ['object', {}]);
    addon.Field('code', ['function']);
});