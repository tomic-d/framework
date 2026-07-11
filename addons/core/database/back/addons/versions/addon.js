import onetype from '#framework/load.js';

const versions = onetype.Addon('database.versions', (addon) =>
{
	addon.Table('database_versions');

	addon.Field('id', ['number']);
	addon.Field('site_id', ['number']);
	addon.Field('addon', ['string', null, true]);
	addon.Field('entity_id', ['number', null, true]);
	addon.Field('operation', ['string', null, true]);
	addon.Field('changes', ['object', null, true]);
	addon.Field('language', ['string']);
	addon.Field('created_at', { type: 'string', metadata: { cast: 'date' } });

	addon.Schema('id bigserial primary key');
	addon.Schema('site_id bigint');
	addon.Schema('addon varchar(255)');
	addon.Schema('entity_id bigint');
	addon.Schema('operation text');
	addon.Schema('changes jsonb');
	addon.Schema('language text');
	addon.Schema('created_at timestamptz default now()');
	addon.Schema('index (addon, entity_id, id)');
	addon.Schema('index (site_id, id)');
});

export default versions;
