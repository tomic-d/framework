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
				if (!node.contains(event.relatedTarget))
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
