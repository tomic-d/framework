import divhunt from '#framework/load.js';

const database = divhunt.Addon('database', (addon) =>
{
    addon.Field('id', ['string']);
    addon.Field('port', ['number', 5432]);
    addon.Field('connection', ['function|object']);
    addon.Field('hostname', ['string']);
    addon.Field('username', ['string']);
    addon.Field('password', ['string']);
    addon.Field('database', ['string']);
});

export default database;