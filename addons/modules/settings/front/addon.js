import onetype from '#onetype';

const settings = onetype.Addon('settings', (addon) =>
{
    addon.Field('id', ['string', null, true]);
    addon.Field('value', ['any', null]);
    addon.Field('default', ['any', null]);
    addon.Field('type', ['string', 'any']);
    addon.Field('persist', ['boolean', false]);
    addon.Field('description', ['string', null]);
});

export default settings;
