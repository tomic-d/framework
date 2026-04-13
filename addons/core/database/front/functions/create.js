database.Fn('create', async function(item, translation)
{
	const result = await database.Fn('batch', 'create', {
		addon: item.addon.name,
		data: item.data,
		translation
	});

	if(result.code !== 200)
	{
		throw onetype.Error(result.code, result.message);
	}

	item.SetData(result.data.item, false);
	return item;
});
