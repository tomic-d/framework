const match = () =>
{
	setTimeout(() =>
	{
		const result = pages.Fn('match');

		if(!result)
		{
			// Try to find a 404 page
			const notFoundPage = Object.values(pages.Items()).find(p => p.Get('404'));

			if(notFoundPage)
			{
				pages.Fn('open', notFoundPage.Get('id'), {});
			}

			return;
		}

		pages.Fn('open', result.page.Get('id'), result.parameters);
	});
};

onetype.EmitOn('document.load', match);
onetype.EmitOn('history.popstate', match);
