import divhunt from '#divhunt';

const sources = divhunt.Addon('sources', (addon) =>
{
    addon.Field('id', ['string']);
    addon.Field('name', ['string', null]);
    addon.Field('group', ['string', null]);
    addon.Field('description', ['string', null]);
    addon.Field('action', ['string|object', null]);
    addon.Field('command', ['string|object', null]);
    addon.Field('endpoint', ['string', null]);
    addon.Field('method', ['string', 'GET']);
    addon.Field('headers', ['object', null]);
    addon.Field('body', ['object|string', null]);
    addon.Field('in', ['object', null]);
    addon.Field('out', ['object', null]);
    addon.Field('callback', ['function', null]);
});

export default sources;
