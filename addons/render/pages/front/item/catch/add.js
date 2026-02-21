pages.ItemOn('add', (item) =>
{
	const map = item.Get('areas');

	if(map)
	{
		Object.keys(map).forEach(name =>
		{
			const id = map[name];

			if(typeof id === 'function')
			{
				pages.RenderAdd(item.Get('id') + ':' + name, function(parameters)
				{
					this.Define({
						parameters: ['object', {}]
					});

					return id.call(this, parameters);
				});
			}
		});
	}
});
