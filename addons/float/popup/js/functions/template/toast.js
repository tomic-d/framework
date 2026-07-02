popup.Fn('template.toast', function(message, options = {})
{
	const config = onetype.DataDefine(typeof message === 'object' ? { ...message } : { message }, {
		type: { type: 'string', value: 'success', options: ['info', 'success', 'warning', 'error'] },
		title: { type: 'string' },
		message: { type: 'string' },
		icon: { type: 'string' },
		closeable: { type: 'boolean', value: true },
		duration: { type: 'number', value: 5000 }
	});

	options = onetype.DataDefine({ ...options }, {
		id: { type: 'string' },
		position: {
			type: 'object',
			value: { x: 'center', y: 'bottom' },
			config: {
				x: { type: 'string', value: 'center' },
				y: { type: 'string', value: 'bottom' }
			}
		},
		padding: { type: 'number', value: 16 },
		onOpen: { type: 'function' },
		onClose: { type: 'function' }
	});

	const overlay = overlays.Item({
		id: options.id || 'toast-' + onetype.GenerateUID(),
		position: options.position,
		padding: options.padding,
		flip: false,
		escape: true,
		onClose: (item) =>
		{
			popup.Fn('stack');

			if(options.onClose)
			{
				options.onClose(item);
			}
		},
		onOpen: options.onOpen,
		render: function()
		{
			this.config = config;

			this.close = () =>
			{
				overlay.Remove();
			};

			return '<e-popup-toast :config="config" :_close="close"></e-popup-toast>';
		}
	});

	const box = overlay.Get('element')?.querySelector('.box');

	if(box)
	{
		onetype.ObserverResize(box, () => popup.Fn('stack'));
	}

	if(config.duration > 0)
	{
		setTimeout(() =>
		{
			if(overlays.ItemGet(overlay.Get('id')))
			{
				overlay.Remove();
			}
		}, config.duration);
	}

	return overlay;
});
