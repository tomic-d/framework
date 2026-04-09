database.Fn('create', async function(item, translation)
{
	const result = await $ot.command('database:create', {
		addon: item.addon.name,
		data: item.data,
		translation
	}, true);

	item.SetData(result.data.item, false);
	return item;
});
