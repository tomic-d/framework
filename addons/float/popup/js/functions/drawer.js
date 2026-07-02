popup.Fn('panel', function(options = {})
{
	const id = options.id || 'panel-' + onetype.GenerateUID();
	const place = options.position || 'center';

	const positions = {
		center: {x: 'center', y: 'center'},
		right:  {x: 'right-in', y: 'top-in'},
		left:   {x: 'left-in', y: 'top-in'},
		bottom: {x: 'center', y: 'bottom-in'},
		top:    {x: 'center', y: 'top-in'}
	};

	const config = {
		title: options.title || '',
		description: options.description || '',
		content: options.content,
		actions: options.actions || [],
		clean: options.clean === true,
		width: options.width || 'm',
		padding: options.padding || 'm',
		place: place
	};

	return overlays.Item({
		id: id,
		position: positions[place] || positions.center,
		padding: 16,
		backdrop: options.backdrop ?? 0.4,
		closeable: options.closeable !== false,
		escape: options.escape !== false,
		onClose: options.onClose,
		onOpen: (item) =>
		{
			const element = item.Get('element');

			if(element)
			{
				element.classList.add('ot-panel', 'ot-panel-' + place);
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

			return '<e-popup-panel :config="config" :_close="close"></e-popup-panel>';
		}
	});
});
