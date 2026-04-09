import onetype from '#framework/load.js';

onetype.EmitOn('@addon.init', (addon) =>
{
	addon.database =
	{
		expose: null,
		table: null,
		translations: null
	};

	addon.Table = function(name)
	{
		addon.database.table = { name };
	};

	addon.Expose = function(config)
	{
		addon.database.expose = onetype.DataDefine(config,
		{
			filter: ['array', []],
			sort: ['array', []],
			select: ['array', []],
			find: ['function'],
			create: ['function'],
			update: ['function'],
			delete: ['function']
		});
	};

	addon.Translations = function(config)
	{
		addon.database.translations = config;
	};

	addon.Find = function({connection = 'primary', translation = null} = {})
	{
		translation = onetype.LanguageValidate(translation || onetype.Language());

		return onetype.AddonGet('database').Fn('items.find', {connection, translation, table: addon.database.table, addon});
	};
});