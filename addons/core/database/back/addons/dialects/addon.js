import onetype from '#framework/load.js';

/* Registry of dialect operations. Each item is ONE operation for ONE engine
   (dialect + operation + code). The core never knows the operation set ahead of
   time: add an item to add an operation or an engine. The dialects subaddon
   resolves the right item by dialect + operation when the core asks. */

const dialects = onetype.Addon('database.dialects', (addon) =>
{
	addon.Field('dialect', {
		type: 'string',
		required: true,
		description: 'knex.client.dialect this item handles (postgresql | mysql | sqlite3).'
	});

	addon.Field('operation', {
		type: 'string',
		required: true,
		description: 'Operation name this item implements (stamp, insert, jsonContains, ...).'
	});

	addon.Field('code', {
		type: 'function',
		required: true,
		description: 'Handler for this operation on this engine.'
	});
});

export default dialects;
