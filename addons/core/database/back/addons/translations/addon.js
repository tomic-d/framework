import onetype from '#framework/load.js';
import database from '../../addon.js';

database.translations = onetype.Addon('database.translations', (addon) =>
{
	addon.Table('database_translations');

	addon.Field('id', ['string']);
	addon.Field('entity', ['string', null, true]);
	addon.Field('entity_id', ['string', null, true]);
	addon.Field('language', ['string', null, true]);
	addon.Field('field', ['string', null, true]);
	addon.Field('value', ['string']);
	addon.Field('updated_at', ['string']);
	addon.Field('created_at', ['string']);
});

export default database.translations;
