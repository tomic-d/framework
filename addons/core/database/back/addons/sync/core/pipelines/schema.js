import onetype from '#framework/load.js';
import database from '#database/addon.js';
import sync from '#database/addons/sync/addon.js';

onetype.Pipeline('database:sync:schema', {
	description: 'Introspect the real database state of one addon table: columns, indexes and foreign keys, without changing anything.',
	in: {
		connection: {
			type: 'string',
			value: 'primary',
			description: 'Connection id to introspect.'
		},
		addon: {
			type: 'string',
			required: true,
			description: 'Addon name whose table to read.'
		}
	},
	out: {
		schema: {
			type: 'object',
			config: 'database.sync.schema'
		}
	}
})

.Join('schema', 10, {
	description: 'Read the live table shape from the database.',
	out: {
		schema: {
			type: 'object',
			config: 'database.sync.schema'
		}
	},
	callback: async function({ connection, addon }, resolve)
	{
		const knex = database.Fn('connection', connection);
		const target = onetype.AddonGet(addon);

		if(!target || !target.Table())
		{
			return resolve(null, 'Addon "' + addon + '" has no table set.', 404);
		}

		const name = target.Table().name;
		const exists = await knex.schema.hasTable(name);

		const schema = {
			table: { name, exists },
			columns: {},
			indexes: [],
			relations: []
		};

		if(exists)
		{
			schema.columns = await knex(name).columnInfo();
			schema.indexes = await sync.Fn('get.indexes', knex, name);
			schema.relations = await sync.Fn('get.foreign', knex, name);
		}

		return { schema };
	}
});
