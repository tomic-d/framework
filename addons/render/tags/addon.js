import onetype from '#framework/load.js';

const tags = onetype.Addon('tags', (addon) =>
{
    addon.Field('id', ['string']);
    addon.Field('closeable', ['boolean', true]);
    addon.Field('text', ['boolean', true]);
    addon.Field('nest', ['object', {}]);
});

export default tags;