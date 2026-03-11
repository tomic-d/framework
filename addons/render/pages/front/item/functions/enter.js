pages.Fn('item.enter', async function(item, parameters = {}, data = null)
{
	if(item.Get('onBeforeEnter') && item.Get('onBeforeEnter').call(item, parameters, data) === false)
	{
		return false;
	}

	pages.StoreSet('active', item);

	onetype.StateSet('page', { 
		id: item.Get('id'), 
		route: item.Get('route'), 
		meta: item.Get('meta'),
		parameters,
		data, 
		'404': item.Get('404') 
	});

	const title = item.Get('title');

	if(title)
	{
		document.title = typeof title === 'function' ? title.call(item, parameters, data) : title;
	}

	const element = item.Fn('render', parameters, data);
	item.Set('element', element);

	document.body.appendChild(element);

	item.Get('onEnter') && item.Get('onEnter').call(item, parameters, data);

	onetype.Emit('pages:enter', { page: item, parameters, data });

	return true;
});
