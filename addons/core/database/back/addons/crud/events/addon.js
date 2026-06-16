import onetype from '#framework/load.js';

/* addon.Find opens a find chain over the addon's table; addon.Expose declares the
   HTTP CRUD surface (which fields/ops are reachable over the API). Both live with
   crud. Registered on @addon.init so every addon gets them. */

onetype.EmitOn('@addon.init', (addon) =>
{
	addon.database.expose = null;

	addon.Find = function({connection = 'primary', language = null, languages = null} = {})
	{
		return onetype.AddonGet('database').Fn('find', {connection, language, languages, table: addon.Table(), addon});
	};

	addon.Expose = function(config)
	{
		if(config === undefined)
		{
			return addon.database.expose;
		}

		addon.database.expose = onetype.DataDefine(config,
		{
			filter: ['array', []],
			sort: ['array', []],
			select: ['array', []],
			find: ['function'],
			create: ['function'],
			update: ['function'],
			delete: ['function'],
			history: ['function'],
			restore: ['function']
		});
	};
});
