overlays.Fn('flip', function(target, overlay, position, offset, padding, gap)
{
	position = position || {x: 'center', y: 'center'};
	padding = padding || 10;

	const width = overlay.offsetWidth;
	const height = overlay.offsetHeight;
	const viewport = {width: window.innerWidth, height: window.innerHeight};

	const pos = {x: position.x, y: position.y};
	let flipped = {x: false, y: false};

	let result = overlays.Fn('position', target, overlay, pos, offset, padding, gap);

	if (pos.y === 'bottom' && (result.top + height) > (viewport.height - padding))
	{
		pos.y = 'top';
		flipped.y = true;
	}
	else if (pos.y === 'top' && result.top < padding)
	{
		pos.y = 'bottom';
		flipped.y = true;
	}

	if (pos.x === 'right' && (result.left + width) > (viewport.width - padding))
	{
		pos.x = 'left';
		flipped.x = true;
	}
	else if (pos.x === 'left' && result.left < padding)
	{
		pos.x = 'right';
		flipped.x = true;
	}

	if (flipped.x || flipped.y)
	{
		result = overlays.Fn('position', target, overlay, pos, offset, padding, gap);
	}

	return {
		left: Math.round(result.left),
		top: Math.round(result.top),
		position: pos,
		flipped
	};
});
