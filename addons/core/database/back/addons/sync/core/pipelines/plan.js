import onetype from '#framework/load.js';
import sync from '#database/addons/sync/addon.js';

onetype.Pipeline('database:sync:plan', {
	description: 'Diff one addon definition against the live database schema and describe what is out of sync, without changing anything.',
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
			config: 'database.sync.plan'
		}
	}
})

.Join('schema', 10, {
	description: 'Read the live schema and start a blank plan.',
	out: {
		schema: { type: 'object', config: 'database.sync.schema' },
		plan:   { type: 'object', config: 'database.sync.plan' }
	},
	callback: async function({ connection, addon })
	{
		const { schema } = await this.Pipeline('database:sync:schema', { connection, addon });

		const plan = {
			connection,
			addon,
			table: schema.table,
			columns: { write: [], extra: [], mismatched: [] },
			keys: { primary: [], index: [], unique: [] },
			relations: [],
			prune: false
		};

		return { schema, plan };
	}
})

.Join('columns', 20, {
	description: 'Diff the addon columns against the live table.',
	requires: ['schema', 'plan'],
	out: {
		plan: { type: 'object', config: 'database.sync.plan' }
	},
	callback: function({ addon, schema, plan })
	{
		const columns = sync.Fn('get.columns', onetype.AddonGet(addon));

		if(!schema.table.exists)
		{
			plan.columns.write = columns;
			return { plan };
		}

		const existing = new Set(Object.keys(schema.columns));
		const desired = new Set(columns.map((column) => column.name));

		plan.columns.write = columns.filter((column) => !existing.has(column.name));
		plan.columns.extra = [...existing].filter((name) => !desired.has(name));
		plan.columns.mismatched = columns.filter((column) =>
		{
			if(!existing.has(column.name) || (column.type !== 'object' && column.type !== 'array'))
			{
				return false;
			}

			return !String(schema.columns[column.name].type).toLowerCase().includes('json');
		}).map((column) => column.name);

		return { plan };
	}
})

.Join('keys', 30, {
	description: 'Diff the primary key, indexes and unique constraints against the live table.',
	requires: ['schema', 'plan'],
	out: {
		plan: { type: 'object', config: 'database.sync.plan' }
	},
	callback: function({ addon, schema, plan })
	{
		const config = onetype.AddonGet(addon).Sync();

		plan.keys.primary = config.primary.fields.length > 1 ? config.primary.fields : [];

		const missing = (groups, isUnique) =>
		{
			const present = schema.indexes
				.filter((entry) => entry.unique === isUnique)
				.map((entry) => [...entry.columns].sort().join(','));

			return groups.filter((group) => !present.includes([...group].sort().join(',')));
		};

		plan.keys.index = schema.table.exists ? missing(config.index, false) : config.index;
		plan.keys.unique = schema.table.exists ? missing(config.unique, true) : config.unique;

		return { plan };
	}
})

.Join('relations', 40, {
	description: 'Diff the foreign keys against the live table.',
	requires: ['schema', 'plan'],
	out: {
		plan: { type: 'object', config: 'database.sync.plan' }
	},
	callback: function({ addon, schema, plan }, resolve)
	{
		for(const relation of onetype.AddonGet(addon).Sync().relations)
		{
			const name = `${schema.table.name}_${relation.field}_foreign`;

			if(schema.relations.includes(name))
			{
				continue;
			}

			const reference = onetype.AddonGet(relation.addon);

			if(!reference || !reference.Table())
			{
				return resolve(null, 'Relation "' + relation.field + '" targets addon "' + relation.addon + '" which has no table set.', 400);
			}

			plan.relations.push({ name, field: relation.field, column: relation.column, table: reference.Table().name, onDelete: relation.onDelete, onUpdate: relation.onUpdate });
		}

		return { plan };
	}
});
