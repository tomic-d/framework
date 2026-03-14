document.addEventListener('click', (event) =>
{
	const items = Object.values(overlays.Items()).sort((a, b) => b.Get('index') - a.Get('index'));

	for (const item of items)
	{
		if (!item.Get('closeable'))
		{
			continue;
		}

		const element = item.Get('element');

		if (!element)
		{
			continue;
		}

		const content = element.querySelector('.content');

		if (!content || !content.contains(event.target))
		{
			item.Remove();
			break;
		}
	}
});
