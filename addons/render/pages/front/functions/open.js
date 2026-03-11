pages.Fn('open', async function(id, parameters = {})
{
	const page = pages.ItemGet(id);

	if(!page)
	{
		return false;
	}

	const data = page.Get('data') ? await page.Get('data').call(page, parameters) : null;

	const active = pages.StoreGet('active');

	if(active && active.Fn('leave') === false)
	{
		return false;
	}

	return await page.Fn('enter', parameters, data);
});
