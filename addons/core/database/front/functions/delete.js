database.Fn('delete', async function(item)
{
	const result = await database.Fn('batch', 'delete', {
		addon: item.addon.name,
		id: item.Get('id')
	});

	if(result.code !== 200)
	{
		throw onetype.Error(result.code, result.message);
	}

	item.Set('id', null);
	return item;
});
