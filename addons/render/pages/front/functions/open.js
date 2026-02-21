pages.Fn('open', async function(id, parameters = {})
{
	const page = pages.ItemGet(id);

	if(!page)
	{
		console.warn(`Page with id "${id}" not found`);
		return false;
	}

	const active = pages.StoreGet('active');

	if(active && active.Fn('leave') === false)
	{
		return false;
	}

	return await page.Fn('enter', parameters);
});
