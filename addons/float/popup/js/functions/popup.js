popup.Fn('popup', function(target, render, options = {})
{
	const id = 'popup-' + onetype.GenerateUID();

	return overlays.Item({
		id: options.id || id,
		target,
		position: options.position || {x: 'center', y: 'bottom'},
		offset: options.offset || {x: 0, y: 4},
		flip: true,
		track: true,
		closeable: true,
		escape: true,
		onClose: options.onClose,
		onOpen: options.onOpen,
		render: typeof render === 'function' ? render : function()
		{
			return render;
		}
	});
});
