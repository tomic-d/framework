pages.Fn('item.leave', function(item)
{
	if(item.Get('onBeforeLeave') && item.Get('onBeforeLeave').call(item) === false)
	{
		return false;
	}

	pages.StoreSet('active', null);

	onetype.StateSet('page', null);

	item.Get('onLeave') && item.Get('onLeave').call(item);

	onetype.Emit('@pages.leave', { page: item });

	const element = item.Get('element');

	if(element)
	{
		element.remove();
		item.Set('element', null);
	}

	return true;
});
