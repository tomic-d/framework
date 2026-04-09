database.Fn('update', async function(item, translation)
{
	const result = await $ot.command('database:update', {
		addon: item.addon.name,
		id: item.Get('id'),
		data: item.data,
		translation
	}, true);

	item.SetData(result.data.item, false);
	return item;
});
