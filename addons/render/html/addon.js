import divhunt from '#framework/load.js';

const html = divhunt.Addon('html', (addon) =>
{
    addon.Field('id', ['string']);
    addon.Field('tag', ['string', 'div']);
    addon.Field('position', ['string', 'head']);
    addon.Field('parent', ['string']);
    addon.Field('content', ['string']);
    addon.Field('attributes', ['object', {}]);
});

export default html;
