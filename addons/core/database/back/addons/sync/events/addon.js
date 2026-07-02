import onetype from '#framework/load.js';

onetype.EmitOn('@addon.init', (addon) =>
{
	addon.database.sync = {
		primary: { fields: ['id'], auto: true },
		index: [],
		unique: [],
		relations: []
	};

	addon.Sync = function(callback)
	{
		if(callback === undefined)
		{
			return addon.database.sync;
		}

		const sync = addon.database.sync;

		callback({
			Primary(fields, options = {})
			{
				const group = Array.isArray(fields) ? fields : [fields];

				sync.primary = { fields: group, auto: group.length === 1 && options.auto !== false };
			},
			Index(fields)
			{
				sync.index.push(Array.isArray(fields) ? fields : [fields]);
			},
			Unique(fields)
			{
				sync.unique.push(Array.isArray(fields) ? fields : [fields]);
			},
			Relation(field, target, options = {})
			{
				sync.relations.push({ field, addon: target, column: options.column || 'id', onDelete: options.onDelete || null, onUpdate: options.onUpdate || null });
			}
		});
	};

	addon.SyncSchema = async function({ connection = 'primary' } = {})
	{
		const result = await onetype.PipelineRun('database:sync:schema', { connection, addon: addon.GetName() });

		if(result.code !== 200)
		{
			throw onetype.Error(result.code, result.message);
		}

		return result.data.schema;
	};

	addon.SyncPlan = async function({ connection = 'primary' } = {})
	{
		const result = await onetype.PipelineRun('database:sync:plan', { connection, addon: addon.GetName() });

		if(result.code !== 200)
		{
			throw onetype.Error(result.code, result.message);
		}

		return result.data.plan;
	};

	addon.SyncApply = async function(plan)
	{
		const result = await onetype.PipelineRun('database:sync:apply', { plan });

		if(result.code !== 200)
		{
			throw onetype.Error(result.code, result.message);
		}

		return result.data;
	};

	addon.SyncRun = async function({ connection = 'primary' } = {})
	{
		return addon.SyncApply(await addon.SyncPlan({ connection }));
	};
});
