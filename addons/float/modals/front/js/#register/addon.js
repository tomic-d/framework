const modals = divhunt.Addon('modals', (addon) =>
{
    addon.Field('id', ['string']);
    addon.Field('backdrop', ['number', 0.5]);
    addon.Field('closeable', ['boolean', true]);
    addon.Field('escape', ['boolean', true]);
    addon.Field('render', ['function', null]);
    addon.Field('onOpen', ['function', null]);
    addon.Field('onClose', ['function', null]);
});
