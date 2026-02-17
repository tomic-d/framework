navbar.Fn('active', function(id)
{
	Object.values(navbar.Items()).forEach(item =>
	{
		item.Set('active', item.Get('id') === id);
	});
});
