pages.ItemOn('removed', (item) =>
{
	const map = item.Get('layouts');

	if(map)
	{
		Object.keys(map).forEach(name =>
		{
			const id = map[name];

			if(typeof id === 'function')
			{
				pages.RenderRemove(item.Get('id') + ':' + name);
			}
		});
	}
});
