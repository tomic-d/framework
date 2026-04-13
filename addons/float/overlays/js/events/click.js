document.addEventListener('mousedown', (event) =>
{
	const items = Object.values(overlays.Items()).sort((a, b) => b.Get('index') - a.Get('index'));

	const insideAny = items.some((item) =>
	{
		const element = item.Get('element');
		const content = element?.querySelector('.content');
		return content && content.contains(event.target);
	});

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

		if (!content)
		{
			continue;
		}

		if (content.contains(event.target))
		{
			break;
		}

		item.Remove();

		if (insideAny)
		{
			break;
		}
	}
});
