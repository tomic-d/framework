overlays.Fn('reposition', function(item)
{
	const element = item.Get('element');
	const content = element?.querySelector('.content');

	if (!content)
	{
		return;
	}

	const target = item.Get('target');
	const position = item.Get('position');
	const offset = item.Get('offset');
	const padding = item.Get('padding');

	let result;

	if (item.Get('flip'))
	{
		result = overlays.Fn('flip', target, content, position, offset, padding);
	}
	else
	{
		result = overlays.Fn('position', target, content, position, offset, padding);
	}

	content.style.left = result.left + 'px';
	content.style.top = result.top + 'px';
});
