pages.Fn('item.leave', function(item)
{
	const onLeave = item.Get('onLeave');
	const onBeforeLeave = item.Get('onBeforeLeave');

	if(onBeforeLeave && onBeforeLeave.call(item) === false)
	{
		return false;
	}

	pages.StoreSet('active', null);

	if(onLeave)
	{
		onLeave.call(item);
	}

	const element = item.Get('element');

	if(element)
	{
		element.remove();
		item.Set('element', null);
	}

	return true;
});
