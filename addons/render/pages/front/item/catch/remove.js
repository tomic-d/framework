pages.ItemOn('removed', (item) =>
{
	const areas = item.Get('areas');

	if(areas)
	{
		for(const [name, value] of Object.entries(areas))
		{
			if(typeof value === 'function')
			{
				pages.RenderRemove(item.Get('id') + ':' + name);
			}
		}
	}
});
