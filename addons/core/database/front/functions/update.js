database.Fn('update', async function(item, language)
{
	const result = await database.Fn('batch', 'update', {
		addon: item.addon.name,
		id: item.Get('id'),
		data: item.data,
		language
	});

	if(result.code !== 200)
	{
		throw onetype.Error(result.code, result.message);
	}

	item.SetData(result.data.item, false);
	return item;
});
