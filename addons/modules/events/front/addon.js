import divhunt from '#divhunt';

const events = divhunt.Addon('events', (addon) =>
{
    addon.Field('id', ['string']);
    addon.Field('group', ['string', null]);
    addon.Field('description', ['string', null]);
    addon.Field('callbacks', ['array', []]);
});

export default events;
