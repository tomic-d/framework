import divhunt from '#framework/load.js';

const tags = divhunt.Addon('tags', (addon) =>
{
    addon.Field('id', ['string']);
    addon.Field('closeable', ['boolean', true]);
    addon.Field('text', ['boolean', true]);
    addon.Field('nest', ['object', {}]);
});

export default tags;