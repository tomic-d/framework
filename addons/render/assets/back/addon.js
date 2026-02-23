import onetype from '#framework/load.js';

const assets = onetype.Addon('assets', (addon) =>
{
    addon.Field('id', ['number']);
    addon.Field('order', ['number']);
    addon.Field('path', ['string']);
    addon.Field('content', ['string|function']);
    addon.Field('type', ['string']);
    addon.Field('ignore', ['array', []]);
});

export default assets;