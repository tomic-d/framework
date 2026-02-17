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

	if(!match)
	{
		return;
	}

	e.preventDefault();

	pages.Fn('change', match.page.Get('id'), match.parameters);
});
