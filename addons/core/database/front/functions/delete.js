database.Fn('delete', async function(item)
{
	const result = await $ot.command('database:delete', {
		addon: item.addon.name,
		id: item.Get('id')
	}, true);

	item.Set('id', null);
	return item;
});
