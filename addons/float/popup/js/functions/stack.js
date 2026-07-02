popup.Fn('stack', function()
{
	const items = Object.values(overlays.Items()).filter((item) => String(item.Get('id')).startsWith('toast-'));

	let offset = 0;

	for(const item of items.reverse())
	{
		const content = item.Get('element')?.querySelector('.content');

		if(!content)
		{
			continue;
		}

		content.style.transform = offset ? 'translateY(-' + offset + 'px)' : '';
		offset += content.offsetHeight + 8;
	}
});
