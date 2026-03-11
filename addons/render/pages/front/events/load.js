const match = () =>
{
	requestAnimationFrame(() =>
	{
		const resolved = pages.Fn('resolve', null, onetype.RouteCurrent());

		if(resolved)
		{
			pages.Fn('open', resolved.id, resolved.parameters);
		}
	});
};

onetype.EmitOn('document.load', match);
onetype.EmitOn('history.popstate', match);
