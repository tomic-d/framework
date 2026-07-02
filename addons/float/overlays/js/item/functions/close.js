overlays.Fn('item.close', function(item)
{
	const scroll = item.StoreGet('scroll');
	const resize = item.StoreGet('resize');

	if(scroll)
	{
		window.removeEventListener('scroll', scroll, true);
	}

	if(resize)
	{
		window.removeEventListener('resize', resize);
	}

	const element = item.Get('element');

	if(element)
	{
		const content = element.querySelector('.content');

		if(content)
		{
			onetype.ObserverUnresize(content);
		}

		element.remove();
	}

	overlays.RenderRemove('overlay:' + item.Get('id'));

	const onClose = item.Get('onClose');

	if(typeof onClose === 'function')
	{
		onClose(item);
	}
});
