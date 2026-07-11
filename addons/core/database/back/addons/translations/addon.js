import onetype from '#framework/load.js';
import database from '../../addon.js';

database.translations = onetype.Addon('database.translations', (addon) =>
{
	addon.Table('database_translations');

	addon.Field('entity', ['string', null, true]);
	addon.Field('entity_id', ['number', null, true]);
	addon.Field('language', ['string', null, true]);
	addon.Field('field', ['string', null, true]);
	addon.Field('value', ['string']);
	addon.Field('updated_at', { type: 'string', metadata: { cast: 'date' } });
	addon.Field('created_at', { type: 'string', metadata: { cast: 'date' } });

	addon.Schema('entity varchar(255)');
	addon.Schema('entity_id bigint');
	addon.Schema('language varchar(255)');
	addon.Schema('field varchar(255)');
	addon.Schema('value text');
	addon.Schema('updated_at timestamptz');
	addon.Schema('created_at timestamptz default now()');
	addon.Schema('primary key (entity, entity_id, language, field)');
});

export default database.translations;
