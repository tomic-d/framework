pages.Fn('open', async function(id, parameters = {})
{
	const page = pages.ItemGet(id);

	if(!page)
	{
		console.warn(`Page with id "${id}" not found`);
		return false;
	}

	const active = pages.StoreGet('active');

	if(page.Get('data'))
	{
		const data = {};
		let loaded = false;

		const promise = page.Get('data').call(page, parameters).then(result =>
		{
			Object.assign(data, result);
			loaded = true;
		});

		await Promise.race([promise, new Promise(resolve => setTimeout(resolve, 500))]);

		if(!loaded)
		{
			if(active && active.Fn('leave') === false)
			{
				return false;
			}

			await promise;
		}
		else
		{
			if(active && active.Fn('leave') === false)
			{
				return false;
			}
		}

		return await page.Fn('enter', parameters, data);
	}

	if(active && active.Fn('leave') === false)
	{
		return false;
	}

	return await page.Fn('enter', parameters);
});
