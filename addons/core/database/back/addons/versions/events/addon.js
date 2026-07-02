import onetype from '#framework/load.js';

onetype.EmitOn('@addon.init', (addon) =>
{
	addon.database.versions = null;

	addon.Versions = function(fields, options)
	{
		if(fields === undefined && options === undefined)
		{
			return addon.database.versions;
		}

		addon.database.versions = {
			fields: fields === '*' ? null : (Array.isArray(fields) ? fields : null),
			invert: options?.invert === true,
			delete: options?.delete || 'deleted_at'
		};
	};

	addon.History = function({ connection = 'primary' } = {})
	{
		return onetype.AddonGet('database.versions').Fn('get.history', addon, null, { connection });
	};

	addon.Restore = async function(version, { connection = 'primary' } = {})
	{
		const result = await onetype.PipelineRun('database:versions:restore', { connection, addon: addon.GetName(), version });

		if(result.code !== 200)
		{
			throw onetype.Error(result.code, result.message);
		}

		return result.data;
	};
});
