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

	addon.Table = function() {};
	addon.Expose = function() {};
	addon.Translations = function() {};
	addon.Search = function() {};
	addon.Versions = function() {};

	addon.Find = function({language = null} = {})
	{
		return database.Fn('find', addon, language);
	};

	addon.History = async function()
	{
		const result = await database.Fn('batch', 'history', {
			addon: addon.name
		});

		if(result.code !== 200)
		{
			throw onetype.Error(result.code, result.message);
		}

		return result.data.items;
	};

	addon.Restore = async function(version)
	{
		const result = await database.Fn('batch', 'restore', {
			addon: addon.name,
			version
		});

		if(result.code !== 200)
		{
			throw onetype.Error(result.code, result.message);
		}

		return result.data;
	};
});
