items.ItemOn('add', (item) =>
{
	if(item.Get('render'))
	{
		items.RenderAdd(item.Get('id'), function()
		{
			const data = item.Get('data');

			// Merge data into render context
			for(const key in data)
			{
				this.Data[key] = data[key];
			}

			return item.Get('render').call(this);
		});
	}
});
