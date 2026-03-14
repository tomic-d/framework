pages.ItemOn('add', (item) =>
{
	const areas = item.Get('areas');

	if(areas)
	{
		for(const [name, value] of Object.entries(areas))
		{
			if(typeof value === 'function')
			{
				pages.RenderAdd(item.Get('id') + ':' + name, function(context)
				{
					const parameters = context?.parameters || {};
					const data = context?.data || {};

					this.Define({
						parameters: ['object', {}],
						data: ['object', {}],
					});

					return value.call(this, {parameters, data});
				});
			}
		}
	}
});
