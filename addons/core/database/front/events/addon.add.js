divhunt.EmitOn('addon.add', (addon) =>
{
	/* Silent Errors */
	addon.Expose = function() 
	{

	};

	addon.Find = function()
	{
		return database.Fn('find', addon);
	};
});
