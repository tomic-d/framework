onetype.EmitOn('@addon.item.init', (item) =>
{
	item.Create = async function({language = null} = {})
	{
		return database.Fn('create', item, language);
	};

	item.Update = async function({language = null} = {})
	{
		return database.Fn('update', item, language);
	};

	item.Delete = async function()
	{
		return database.Fn('delete', item);
	};

	item.History = async function()
	{
		const result = await database.Fn('batch', 'history', {
			addon: item.addon.name,
			entity: item.Get('id')
		});

		if(result.code !== 200)
		{
			throw onetype.Error(result.code, result.message);
		}

		return result.data.items;
	};
});
