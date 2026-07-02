import onetype from '#framework/load.js';
import database from '#database/addon.js';

onetype.Pipeline('database:sync:apply', {
	description: 'Execute one sync plan in ordered phases: create, columns, index, prune.',
	in: {
		plan: {
			type: 'object',
			required: true,
			config: 'database.sync'
		}
	}
})

.Join('connect', 10, {
	description: 'Resolve the plan connection to a live knex shared with the later phases.',
	requires: ['plan'],
	out: {
		knex: {
			type: 'function|object',
			description: 'Live knex for the plan connection.'
		}
	},
	callback: function({ plan }, resolve)
	{
		const item = database.ItemGet(plan.connection);
		const knex = item ? item.Get('connection') : null;

		if(!knex)
		{
			return resolve(null, 'Database connection "' + plan.connection + '" not found.', 404);
		}

		return { knex };
	}
})

.Join('create', 20, {
	description: 'Create the table if it does not exist yet.',
	when: function({ plan })
	{
		return !plan.exists;
	},
	callback: async function({ plan, knex })
	{
		await knex.schema.createTable(plan.table, (builder) =>
		{
			plan.create.forEach((column) => database.Fn('sync.column', builder, column));
		});
	}
})

.Join('columns', 30, {
	description: 'Add missing columns to the existing table.',
	when: function({ plan })
	{
		return plan.exists && plan.add.length > 0;
	},
	callback: async function({ plan, knex })
	{
		await knex.schema.alterTable(plan.table, (builder) =>
		{
			plan.add.forEach((column) => database.Fn('sync.column', builder, column));
		});
	}
})

.Join('index', 40, {
	description: 'Create indexes for the declared groups.',
	when: function({ plan })
	{
		return plan.index.length > 0;
	},
	callback: async function({ plan, knex })
	{
		await knex.schema.alterTable(plan.table, (builder) =>
		{
			plan.index.forEach((group) => builder.index(group, `${plan.table}_${group.join('_')}_index`));
		});
	}
})

.Join('unique', 45, {
	description: 'Create unique constraints for the declared groups.',
	when: function({ plan })
	{
		return plan.unique.length > 0;
	},
	callback: async function({ plan, knex })
	{
		await knex.schema.alterTable(plan.table, (builder) =>
		{
			plan.unique.forEach((group) => builder.unique(group, { indexName: `${plan.table}_${group.join('_')}_unique` }));
		});
	}
})

.Join('prune', 50, {
	description: 'Drop extra columns when the plan allows it.',
	when: function({ plan })
	{
		return plan.prune && plan.extra.length > 0;
	},
	callback: async function({ plan, knex })
	{
		await knex.schema.alterTable(plan.table, (builder) =>
		{
			plan.extra.forEach((name) => builder.dropColumn(name));
		});
	}
});
