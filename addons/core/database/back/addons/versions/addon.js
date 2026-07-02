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

	addon.Sync((sync) =>
	{
		sync.Index(['addon', 'entity_id', 'id']);
		sync.Index(['site_id', 'id']);
	});
});

export default versions;
