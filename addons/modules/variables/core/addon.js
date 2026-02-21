import divhunt from '#framework/load.js';

const variables = divhunt.Addon('variables', (addon) =>
{
    addon.Field('id', ['string']);
    addon.Field('value', ['any']);
    addon.Field('type', ['string']);
    addon.Field('group', ['string', null]);
});

export default variables;
