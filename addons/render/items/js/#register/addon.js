const items = divhunt.Addon('items', (addon) =>
{
    addon.Field('id', ['string|number']);

    addon.Field('group', ['string']);
    addon.Field('order', ['number', 0]);

    addon.Field('before', ['string|number']);
    addon.Field('after', ['string|number']);

    addon.Field('data', ['object', {}]);
    addon.Field('render', ['function']);
    addon.Field('condition', ['function']);
});