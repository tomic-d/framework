items.Fn('groups', function()
{
	const groups = new Set();

	Object.values(this.Items()).forEach(item =>
	{
		const group = item.Get('group');
		
		if(group)
		{
			groups.add(group);
		}
	});

	return Array.from(groups).sort();
});
