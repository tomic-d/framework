import divhunt from '#divhunt';

const bugs = divhunt.Addon('bugs', (addon) =>
{
    addon.Field('id', ['string|number']);
    addon.Field('message', ['string']);
    addon.Field('type', ['string', 'error']);
    addon.Field('source', ['string', null]);
    addon.Field('code', ['number', null]);
    addon.Field('data', ['object', null]);
    addon.Field('time', ['object', null]);
    addon.Field('notify', ['string', 'console']);
    addon.Field('resolved', ['boolean', false]);
});

export default bugs;
