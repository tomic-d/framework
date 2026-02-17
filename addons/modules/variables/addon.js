import divhunt from '#divhunt';

const variables = divhunt.Addon('variables', (addon) =>
{
    addon.Field('id', ['string']);
    addon.Field('value', ['any']);
    addon.Field('type', ['string']);
    addon.Field('key', ['string', null]);
    addon.Field('group', ['string', null]);
});

export default variables;
