import onetype from '#framework/load.js';
import database from '#database/addon.js';
import sync from '#database/addons/sync/addon.js';

onetype.Pipeline('database:sync:apply', {
	description: 'Execute one sync plan in ordered phases: create, columns, index, unique, prune, relations.',
	in: {
		plan: {
			type: 'object',
			required: true,
			config: 'database.sync.plan'
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
	description: 'Create the table with its columns when it does not exist yet.',
	when: function({ plan })
	{
		return !plan.table.exists;
	},
	callback: async function({ plan, knex })
	{
		await knex.schema.createTable(plan.table.name, (builder) =>
		{
			plan.columns.write.forEach((column) => sync.Fn('apply.column', builder, column));

			if(plan.keys.primary.length > 1)
			{
				builder.primary(plan.keys.primary);
			}
		});
	}
})

.Join('columns', 30, {
	description: 'Add missing columns to the existing table.',
	when: function({ plan })
	{
		return plan.table.exists && plan.columns.write.length > 0;
	},
	callback: async function({ plan, knex })
	{
		await knex.schema.alterTable(plan.table.name, (builder) =>
		{
			plan.columns.write.forEach((column) => sync.Fn('apply.column', builder, column));
		});
	}
})

.Join('index', 40, {
	description: 'Create indexes for the declared groups.',
	when: function({ plan })
	{
		return plan.keys.index.length > 0;
	},
	callback: async function({ plan, knex })
	{
		await knex.schema.alterTable(plan.table.name, (builder) =>
		{
			plan.keys.index.forEach((group) => builder.index(group, `${plan.table.name}_${group.join('_')}_index`));
		});
	}
})

.Join('unique', 45, {
	description: 'Create unique constraints for the declared groups.',
	when: function({ plan })
	{
		return plan.keys.unique.length > 0;
	},
	callback: async function({ plan, knex })
	{
		await knex.schema.alterTable(plan.table.name, (builder) =>
		{
			plan.keys.unique.forEach((group) => builder.unique(group, { indexName: `${plan.table.name}_${group.join('_')}_unique` }));
		});
	}
})

.Join('prune', 50, {
	description: 'Drop extra columns when the plan allows it.',
	when: function({ plan })
	{
		return plan.prune && plan.columns.extra.length > 0;
	},
	callback: async function({ plan, knex })
	{
		await knex.schema.alterTable(plan.table.name, (builder) =>
		{
			plan.columns.extra.forEach((name) => builder.dropColumn(name));
		});
	}
})

.Join('relations', 60, {
	description: 'Add the missing foreign keys.',
	when: function({ plan })
	{
		return plan.relations.length > 0;
	},
	callback: async function({ plan, knex })
	{
		await knex.schema.alterTable(plan.table.name, (builder) =>
		{
			plan.relations.forEach((relation) =>
			{
				const foreign = builder.foreign(relation.field, relation.name).references(relation.column).inTable(relation.table);

				if(relation.onDelete)
				{
					foreign.onDelete(relation.onDelete);
				}

				if(relation.onUpdate)
				{
					foreign.onUpdate(relation.onUpdate);
				}
			});
		});
	}
});
