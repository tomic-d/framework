popup.Fn('template.drawer', function(options = {})
{
	options = onetype.DataDefine({ ...options }, {
		id: { type: 'string' },
		title: { type: 'string' },
		description: { type: 'string' },
		content: { type: 'string|function' },
		actions: {
			type: 'array',
			value: [],
			each: {
				type: 'object',
				config: {
					label: { type: 'string', required: true },
					icon: { type: 'string' },
					color: { type: 'string', options: ['brand', 'blue', 'red', 'orange', 'green'] },
					onClick: { type: 'function' }
				}
			}
		},
		clean: { type: 'boolean', value: false },
		width: { type: 'string', value: 'm', options: ['s', 'm', 'l'] },
		padding: { type: 'string', value: 'm', options: ['none', 's', 'm', 'l'] },
		position: { type: 'string', value: 'center', options: ['center', 'right', 'left', 'bottom', 'top'] },
		backdrop: { type: 'number', value: 0.4 },
		closeable: { type: 'boolean', value: true },
		escape: { type: 'boolean', value: true },
		onOpen: { type: 'function' },
		onClose: { type: 'function' }
	});

	const id = options.id || 'drawer-' + onetype.GenerateUID();

	const positions = {
		center: {x: 'center', y: 'center'},
		right:  {x: 'right-in', y: 'top-in'},
		left:   {x: 'left-in', y: 'top-in'},
		bottom: {x: 'center', y: 'bottom-in'},
		top:    {x: 'center', y: 'top-in'}
	};

	const config = {
		title: options.title,
		description: options.description,
		content: options.content,
		actions: options.actions,
		clean: options.clean,
		width: options.width,
		padding: options.padding,
		place: options.position
	};

	return overlays.Item({
		id: id,
		position: positions[options.position],
		padding: 16,
		backdrop: options.backdrop,
		closeable: options.closeable,
		escape: options.escape,
		onClose: options.onClose,
		onOpen: (item) =>
		{
			const element = item.Get('element');

			if(element)
			{
				element.classList.add('ot-drawer', 'ot-drawer-' + options.position);
			}

			if(options.onOpen)
			{
				options.onOpen(item);
			}
		},
		render: function()
		{
			this.config = config;
			this.close = () => popup.Fn('close', id);

			return '<e-popup-drawer :config="config" :_close="close"></e-popup-drawer>';
		}
	});
});
