popup.Fn('template.tooltip', function(target, text, options = {})
{
	const config = onetype.DataDefine(typeof text === 'object' ? { ...text } : { text }, {
		text: { type: 'string' },
		title: { type: 'string' },
		icon: { type: 'string' },
		variant: { type: 'string', value: 'default', options: ['default', 'info', 'success', 'warning', 'error'] }
	});

	options = onetype.DataDefine({ ...options }, {
		id: { type: 'string' },
		position: {
			type: 'object',
			value: { x: 'center', y: 'top' },
			config: {
				x: { type: 'string', value: 'center' },
				y: { type: 'string', value: 'top' }
			}
		},
		offset: {
			type: 'object',
			value: { x: 0, y: 0 },
			config: {
				x: { type: 'number', value: 0 },
				y: { type: 'number', value: 0 }
			}
		},
		gap: { type: 'number', value: 4 },
		onOpen: { type: 'function' },
		onClose: { type: 'function' }
	});

	return overlays.Item({
		id: options.id || 'tooltip-' + onetype.GenerateUID(),
		target,
		position: options.position,
		offset: options.offset,
		gap: options.gap,
		flip: true,
		track: true,
		escape: true,
		onClose: options.onClose,
		onOpen: options.onOpen,
		render: function()
		{
			this.config = config;

			return '<e-popup-tooltip :config="config"></e-popup-tooltip>';
		}
	});
});
