document.addEventListener('click', (e) =>
{
	const a = e.target.closest('a');

	if(!a || !a.href)
	{
		return;
	}

	const url = new URL(a.href);

	if(url.origin !== window.location.origin)
	{
		return;
	}

	const match = pages.Fn('match', url.pathname);

	if(match)
	{
		e.preventDefault();
		pages.Fn('change', match.page.Get('id'), null, match.parameters, true, url.search);
		return;
	}

	const notFound = Object.values(pages.Items()).find(p => p.Get('404'));

	if(notFound)
	{
		e.preventDefault();
		pages.Fn('change', null, url.pathname, {}, true, url.search);
	}
});