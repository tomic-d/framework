document.addEventListener('click', (event) =>
{
	const items = Object.values(overlays.Items()).sort((a, b) => b.Get('index') - a.Get('index'));

	/* Collect all overlay content nodes that contain the click target.
	   Any overlay whose content contains the click should NOT be closed,
	   AND no overlay below it (by z-index) should close either if the
	   click happened inside a higher overlay. */

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

		/* Race-condition guard: if this overlay was opened on this exact click tick,
		   skip closing it. The opener stamps `__justOpened` on the element. */
		if (element.__justOpened)
		{
			element.__justOpened = false;
			continue;
		}

		const content = element.querySelector('.content');

		if (!content)
		{
			continue;
		}

		/* If click is inside this overlay's content, leave it (and everything below) alone */
		if (content.contains(event.target))
		{
			break;
		}

		/* If click is inside SOME other overlay (higher up), only close overlays
		   that are below the clicked one. We're iterating top-down, so if we got
		   here without breaking, this overlay is above the click target overlay
		   (or there is no overlay containing the click). Either way, close it. */
		item.Remove();

		/* Don't break - keep closing lower overlays unless click was inside one of them.
		   But if click WAS inside any overlay, we'd have broken already on that one. */
		if (insideAny)
		{
			break;
		}
	}
});
