import onetype from '#framework/load.js';

onetype.EmitOn('@addon.init', (addon) =>
{
	addon.database =
	{
		expose: null,
		table: null,
		translations: null,
		search: null,
		versions: null
	};

	addon.Table = function(name)
	{
		if(name === undefined)
		{
			return addon.database.table;
		}

		addon.database.table = { name };
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

	addon.Translations = function(config)
	{
		if(config === undefined)
		{
			return addon.database.translations;
		}

		addon.database.translations = config;
	};

	addon.Search = function(config)
	{
		if(config === undefined)
		{
			return addon.database.search;
		}

		addon.database.search = config;
	};

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

	addon.Find = function({connection = 'primary', language = null, languages = null} = {})
	{
		return onetype.AddonGet('database').Fn('find', {connection, language, languages, table: addon.Table(), addon});
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
