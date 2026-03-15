popup.Fn('modal', function(render, options = {})
{
	const id = 'modal-' + onetype.GenerateUID();

	return overlays.Item({
		id: options.id || id,
		position: {x: 'center', y: 'center'},
		backdrop: options.backdrop ?? 0.5,
		closeable: options.closeable !== false,
		escape: options.escape !== false,
		onClose: options.onClose,
		onOpen: (item) =>
		{
			const element = item.Get('element');

			if(element)
			{
				element.classList.add('ot-modal');
			}

			if(options.onOpen)
			{
				options.onOpen(item);
			}
		},
		render: typeof render === 'function' ? render : function()
		{
			return render;
		}
	});
});
