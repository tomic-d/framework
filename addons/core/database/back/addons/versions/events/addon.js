import onetype from '#framework/load.js';

/* The Versions setter and the History/Restore readers all live with versions.
   Registered on @addon.init so every addon can opt into versioning. */

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

	addon.History = function({connection = 'primary'} = {})
	{
		return onetype.AddonGet('database.versions').Fn('history', addon, null, {connection});
	};

	addon.Restore = function(versionId, {connection = 'primary'} = {})
	{
		return onetype.AddonGet('database.versions').Fn('restore', addon, versionId, {connection});
	};
});
