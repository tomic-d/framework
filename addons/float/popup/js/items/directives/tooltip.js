onetype.AddonReady('directives', function(directives)
{
	document.addEventListener('mouseover', function(event)
	{
		let node = event.target;

		while (node && node !== document)
		{
			if ('otTooltipConfig' in node && !node.otTooltipShow)
			{
				node.otTooltipShow = true;

				const config = node.otTooltipConfig;
				const options = {};

				if (config.position) options.position = config.position;
				if (config.offset)   options.offset   = config.offset;

				const content = {
					text:    config.text    || '',
					title:   config.title   || null,
					icon:    config.icon    || null,
					variant: config.variant || 'default'
				};

				node.otTooltipOverlay = popup.Fn('tooltip', node, content, options);
				break;
			}

			node = node.parentNode;
		}
	});

	document.addEventListener('mouseout', function(event)
	{
		let node = event.target;

		while (node && node !== document)
		{
			if ('otTooltipConfig' in node && node.otTooltipShow)
			{
				const related = event.relatedTarget;

				/* Skip if mouse moved into the tooltip overlay itself */
				if (related && node.otTooltipOverlay)
				{
					const overlay = node.otTooltipOverlay.Get('element');

					if (overlay && overlay.contains(related))
					{
						break;
					}
				}

				if (!node.contains(related))
				{
					node.otTooltipShow = false;

					if (node.otTooltipOverlay)
					{
						node.otTooltipOverlay.Remove();
						node.otTooltipOverlay = null;
					}
				}

				break;
			}

			node = node.parentNode;
		}
	});

	/* Close tooltip when mouse leaves the overlay itself */
	document.addEventListener('mouseout', function(event)
	{
		const overlay = event.target.closest('.ot-overlay');

		if (!overlay)
		{
			return;
		}

		const id = overlay.getAttribute('data-id');

		if (!id || !id.startsWith('tooltip-'))
		{
			return;
		}

		const related = event.relatedTarget;

		if (overlay.contains(related))
		{
			return;
		}

		const item = overlays.ItemGet(id);

		if (!item)
		{
			return;
		}

		const target = item.Get('target');

		if (related && target && target.contains(related))
		{
			return;
		}

		item.Remove();

		if (target && 'otTooltipShow' in target)
		{
			target.otTooltipShow = false;
			target.otTooltipOverlay = null;
		}
	});

	directives.ItemAdd({
		id: 'ot-tooltip',
		icon: 'info',
		name: 'Tooltip',
		description: 'Shows tooltip on hover.',
		trigger: 'node',
		order: 600,
		attributes: {
			'ot-tooltip': ['string|object']
		},
		code: function(data, item, compile, node)
		{
			const value = data['ot-tooltip'].value;

			if (!value)
			{
				return;
			}

			if (typeof value === 'string')
			{
				node.otTooltipConfig = {text: value};
			}
			else if (typeof value === 'object')
			{
				node.otTooltipConfig = value;
			}

			node.otTooltipShow = false;
		}
	});
});
