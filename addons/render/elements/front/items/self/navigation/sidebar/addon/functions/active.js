sidebar.Fn('active', function(id)
{
	Object.values(sidebar.Items()).forEach(item =>
	{
		item.Set('active', item.Get('id') === id);
	});
});
