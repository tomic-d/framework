document.addEventListener('mousedown', (event) =>
{
	const items = Object.values(overlays.Items()).sort((a, b) => b.Get('index') - a.Get('index'));

	for (const item of items)
	{
		const element = item.Get('element');
		const content = element?.querySelector('.content');

		if (!content)
		{
			continue;
		}

		if (content.contains(event.target))
		{
			break;
		}

		if (!item.Get('closeable'))
		{
			continue;
		}

		const target = item.Get('target');

		if (target && target.contains(event.target))
		{
			continue;
		}

		item.Remove();
	}
});
