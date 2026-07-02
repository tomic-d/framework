overlays.Fn('reposition', function(item)
{
	const element = item.Get('element');

	if (!element || element.classList.contains('ot-modal'))
	{
		return;
	}

	const content = element.querySelector('.content');

	if (!content)
	{
		return;
	}

	const target = item.Get('target') || document.body;
	const position = item.Get('position');
	const offset = item.Get('offset');
	const padding = item.Get('padding');
	const gap = item.Get('gap');
	const method = item.Get('flip') ? 'flip' : 'position';

	let result = overlays.Fn(method, target, content, position, offset, padding, gap);

	if (item.Get('snap'))
	{
		result = overlays.Fn('snap', result, content, padding);
	}

	content.style.left = result.left + 'px';
	content.style.top = result.top + 'px';
});
