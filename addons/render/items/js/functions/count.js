items.Fn('count', function(group = null)
{
	if(!group)
	{
		return Object.keys(this.Items()).length;
	}

	return Object.values(this.Items()).filter(item => item.Get('group') === group).length;
});
