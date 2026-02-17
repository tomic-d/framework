import divhunt from '#divhunt';

const schedules = divhunt.Addon('schedules', (addon) =>
{
    addon.Table('schedules');

    addon.Field('id', ['string']);
    addon.Field('name', ['string', null]);
    addon.Field('group', ['string', null]);
    addon.Field('description', ['string', null]);
    addon.Field('type', ['string', 'once']);
    addon.Field('time', ['string|number']);
    addon.Field('command', ['string|object', null]);
    addon.Field('callback', ['function', null]);
    addon.Field('enabled', ['boolean', true]);
    addon.Field('repeat', ['number', null]);
    addon.Field('timezone', ['string', null]);
    addon.Field('runs', ['number', 0]);
    addon.Field('timer', ['any', null]);
    addon.Field('last', ['string', null]);
    addon.Field('next', ['string', null]);
    addon.Field('created_at', ['string', null]);
    addon.Field('updated_at', ['string', null]);
});

export default schedules;
