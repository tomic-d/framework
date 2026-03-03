import onetype from 'onetype';

const providers = onetype.Addon('providers', (addon) =>
{
    addon.Field('id', ['string']);
    addon.Field('name', ['string', '']);
    addon.Field('endpoint', ['string']);
    addon.Field('key', ['string', '']);
    addon.Field('default', ['boolean', false]);
    addon.Field('model', ['string', '']);
    addon.Field('models', ['object', {}]);
    addon.Field('onBeforeRequest', ['function']);
    addon.Field('onAfterRequest', ['function']);
});

export default providers;
