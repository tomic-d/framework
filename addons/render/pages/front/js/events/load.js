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

divhunt.EmitOn('document.load', match);
divhunt.EmitOn('history.popstate', match);
