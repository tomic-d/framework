import onetype from '#framework/load.js';
import database from '#database/addon.js';

onetype.Pipeline('database:sync:plan', {
	description: 'Diff one addon table against its definition on one connection and describe what is out of sync, without changing the database.',
	in: {
		connection: {
			type: 'string',
			value: 'primary',
			description: 'Connection id to plan against.'
		},
		addon: {
			type: 'string',
			required: true,
			description: 'Addon name whose table to plan.'
		}
	},
	out: {
		plan: {
			type: 'object',
			config: 'database.sync'
		}
	}
})

.Join('plan', 10, {
	description: 'Diff the addon against the real table and build its sync step.',
	out: {
		plan: {
			type: 'object',
			config: 'database.sync'
		}
	},
	callback: async function({ connection, addon }, resolve)
	{
		const item = database.ItemGet(connection);
		const knex = item ? item.Get('connection') : null;

		if(!knex)
		{
			return resolve(null, 'Database connection "' + connection + '" not found.', 404);
		}

		const target = onetype.AddonGet(addon);

		if(!target || typeof target.Table !== 'function' || !target.Table())
		{
			return resolve(null, 'Addon "' + addon + '" has no table set.', 404);
		}

		const table = target.Table();
		const columns = database.Fn('sync.columns', target);
		const exists = await knex.schema.hasTable(table.name);

		const index = target.Index();
		const unique = target.Unique();

		const plan = {
			connection,
			addon,
			table: table.name,
			prune: table.prune === true,
			exists,
			create: [],
			add: [],
			index: [],
			unique: [],
			extra: [],
			mismatched: []
		};

		if(exists)
		{
			const { missing, extra, mismatched } = await database.Fn('sync.diff', knex, table.name, columns);

			plan.add = missing;
			plan.index = await database.Fn('sync.keys', knex, table.name, index, false);
			plan.unique = await database.Fn('sync.keys', knex, table.name, unique, true);
			plan.extra = extra;
			plan.mismatched = mismatched;
		}
		else
		{
			plan.create = columns;
			plan.index = index;
			plan.unique = unique;
		}

		return { plan };
	}
});
