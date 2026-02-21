pages.Fn('item.enter', async function(item, parameters = {})
{
	const onEnter = item.Get('onEnter');
	const onBeforeEnter = item.Get('onBeforeEnter');

	const data = {};

	if(item.Get('data'))
	{
		Object.assign(data, await item.Get('data').call(item, parameters));
	}

	if(onBeforeEnter && onBeforeEnter.call(item, parameters, data) === false)
	{
		return false;
	}

	pages.StoreSet('active', item);

	const title = item.Get('title');

	if(title)
	{
		if(typeof title === 'function')
		{
			document.title = title.call(item, parameters, data);
		}
		else
		{
			document.title = title;
		}
	}

	const element = item.Fn('render', parameters, data);
	item.Set('element', element);

	document.body.appendChild(element);

	if(onEnter)
	{
		onEnter.call(item, parameters, data);
	}

	return true;
});
