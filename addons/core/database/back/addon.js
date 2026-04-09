import onetype from '#framework/load.js';

const database = onetype.Addon('database', (addon) =>
{
    addon.Field('id', ['string']);
    addon.Field('port', ['number', 5432]);
    addon.Field('connection', ['function|object']);
    addon.Field('hostname', ['string']);
    addon.Field('username', ['string']);
    addon.Field('password', ['string']);
    addon.Field('database', ['string']);

    addon.translations = onetype.Addon('database.translations', (addon) =>
    {
        addon.Table('translations');

        addon.Field('id', ['string']);
        addon.Field('entity', ['string', null, true]);
        addon.Field('entity_id', ['string', null, true]);
        addon.Field('language', ['string', null, true]);
        addon.Field('field', ['string', null, true]);
        addon.Field('value', ['string']);
        addon.Field('updated_at', ['string']);
        addon.Field('created_at', ['string']);
    });
});

export default database;