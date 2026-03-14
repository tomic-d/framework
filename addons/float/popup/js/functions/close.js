popup.Fn('close', function(id)
{
	if (id)
	{
		const item = overlays.ItemGet(id);

		if (item)
		{
			item.Remove();
		}

		return;
	}

	const items = Object.values(overlays.Items()).sort((a, b) => b.Get('index') - a.Get('index'));

	if (items.length)
	{
		items[0].Remove();
	}
});

onetype.$ot.close = function(id)
{
	return popup.Fn('close', id);
};
