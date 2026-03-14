overlays.ItemOn('remove', (item) =>
{
	const scroll = item.StoreGet('scroll');
	const resize = item.StoreGet('resize');

	if (scroll)
	{
		window.removeEventListener('scroll', scroll, true);
	}

	if (resize)
	{
		window.removeEventListener('resize', resize);
	}

	const element = item.Get('element');

	if (element)
	{
		element.remove();
	}

	const onClose = item.Get('onClose');

	if (typeof onClose === 'function')
	{
		onClose(item);
	}
});
