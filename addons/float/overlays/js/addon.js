const overlays = onetype.Addon('overlays', (addon) =>
{
	addon.Field('id', {
		type: 'string',
		description: 'Unique overlay id.'
	});

	addon.Field('render', {
		type: 'function',
		description: 'Render of the overlay content, called with the item.'
	});

	addon.Field('element', {
		type: 'object',
		description: 'Mounted overlay wrapper element, set by the engine.'
	});

	addon.Field('target', {
		type: 'object',
		description: 'Anchor element the overlay positions against. Without it the overlay positions against the viewport.'
	});

	addon.Field('position', {
		type: 'object',
		value: { x: 'center', y: 'center' },
		config: {
			x: {
				type: 'string',
				value: 'center',
				options: ['left', 'left-in', 'center', 'right-in', 'right'],
				description: 'Horizontal placement. left and right sit outside the target, left-in and right-in align to its inner edges, center centers on it.'
			},
			y: {
				type: 'string',
				value: 'center',
				options: ['top', 'top-in', 'center', 'bottom-in', 'bottom'],
				description: 'Vertical placement. top and bottom sit outside the target, top-in and bottom-in align to its inner edges, center centers on it.'
			}
		},
		description: 'Where the overlay sits around the target. The two axes combine into any spot around or inside it.'
	});

	addon.Field('offset', {
		type: 'object',
		value: { x: 0, y: 0 },
		config: {
			x: {
				type: 'number',
				value: 0,
				description: 'Horizontal offset in pixels, added after positioning.'
			},
			y: {
				type: 'number',
				value: 0,
				description: 'Vertical offset in pixels, added after positioning.'
			}
		},
		description: 'Pixel nudge applied after positioning.'
	});

	addon.Field('gap', {
		type: 'number',
		value: 0,
		description: 'Distance in pixels between the overlay and the target for outside placements, pushed away from it. Flips together with flip.'
	});

	addon.Field('flip', {
		type: 'boolean',
		value: true,
		description: 'Flips to the opposite side of the target when the preferred side does not fit the viewport.'
	});

	addon.Field('snap', {
		type: 'boolean',
		value: true,
		description: 'Keeps the overlay inside the viewport, clamped to its edges minus padding.'
	});

	addon.Field('padding', {
		type: 'number',
		value: 10,
		description: 'Gap in pixels used by inner placements and as the viewport margin for snap and flip.'
	});

	addon.Field('index', {
		type: 'number',
		value: 100000,
		description: 'Stacking order. New overlays go above the highest one.'
	});

	addon.Field('backdrop', {
		type: 'number',
		description: 'Backdrop opacity between 0 and 1. Empty renders no backdrop.'
	});

	addon.Field('closeable', {
		type: 'boolean',
		value: false,
		description: 'Closes the overlay when the click lands outside of it.'
	});

	addon.Field('escape', {
		type: 'boolean',
		value: false,
		description: 'Closes the overlay on the Escape key.'
	});

	addon.Field('track', {
		type: 'boolean',
		value: false,
		description: 'Repositions the overlay while the page scrolls, for anchored popups.'
	});

	addon.Field('onOpen', {
		type: 'function',
		description: 'Called with the item before the overlay mounts.'
	});

	addon.Field('onClose', {
		type: 'function',
		description: 'Called with the item after the overlay closes.'
	});
});
