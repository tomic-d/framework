pages.ItemOn('add', (item) =>
{
	const areas = item.Get('areas');

	if(areas)
	{
		for(const [name, value] of Object.entries(areas))
		{
			if(typeof value === 'function')
			{
				pages.RenderAdd(item.Get('id') + ':' + name, function(parameters)
				{
					this.Define({
						parameters: ['object', {}]
					});

					return value.call(this, parameters);
				});
			}
		}
	}
});
