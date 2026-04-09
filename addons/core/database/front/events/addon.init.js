onetype.EmitOn('@addon.init', (addon) =>
{
	addon.database =
	{
		expose: null,
		table: null,
		translations: null
	};

	addon.Table = function() {};
	addon.Expose = function() {};
	addon.Translations = function() {};

	addon.Find = function({translation = null} = {})
	{
		translation = translation ? translation : onetype.Language();

		return database.Fn('find', addon, translation);
	};
});

onetype.EmitOn('@addon.item.init', (item) =>
{
	item.Create = async function({translation = null} = {})
	{
		translation = translation || onetype.Language();

		return database.Fn('create', item, translation);
	};

	item.Update = async function({translation = null} = {})
	{
		translation = translation || onetype.Language();

		return database.Fn('update', item, translation);
	};

	item.Delete = async function()
	{
		return database.Fn('delete', item);
	};
});