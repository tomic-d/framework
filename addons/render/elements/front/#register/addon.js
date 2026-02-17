const elements = divhunt.Addon('elements', (addon) =>
{
    addon.Field('id', ['string']);
    addon.Field('icon', ['string', 'extension']);
    addon.Field('name', ['string', '']);
    addon.Field('description', ['string', '']);
    addon.Field('category', ['string', '']);
    addon.Field('collection', ['string', '']);
    addon.Field('config', ['object', {}]);
    addon.Field('example', ['array', []]);
    addon.Field('render', ['function']);
});