popup.Fn('toast', function(message, options = {})
{
	const config = typeof message === 'object' ? message : { message, type: 'success' };
	const id = 'toast-' + onetype.GenerateUID();
	const duration = config.duration ?? options.duration ?? 5000;

	const overlay = overlays.Item({
		id: options.id || id,
		position: options.position || {x: 'right-in', y: 'top-in'},
		padding: options.padding || 16,
		flip: false,
		escape: true,
		onClose: options.onClose,
		onOpen: options.onOpen,
		render: function()
		{
			const icons = {info: 'info', success: 'check_circle', warning: 'warning', error: 'error'};

			this.type = config.type || 'info';
			this.title = config.title || null;
			this.message = config.message || '';
			this.icon = config.icon || icons[this.type] || 'info';
			this.closeable = config.closeable !== false;

			this.close = () =>
			{
				overlay.Remove();
			};

			return `
				<div :class="'ot-toast ' + type">
					<i class="icon">{{ icon }}</i>
					<div class="content">
						<div ot-if="title" class="title">{{ title }}</div>
						<div ot-if="message" class="message">{{ message }}</div>
					</div>
					<button ot-if="closeable" class="close" ot-click="close"><i>close</i></button>
				</div>
			`;
		}
	});

	if (duration > 0)
	{
		setTimeout(() =>
		{
			if (overlays.ItemGet(overlay.Get('id')))
			{
				overlay.Remove();
			}
		}, duration);
	}

	return overlay;
});
