overlays.Fn('snap', function(result, overlay, padding)
{
	const width = overlay.offsetWidth;
	const height = overlay.offsetHeight;
	const pad = padding || 0;

	return {
		...result,
		left: Math.round(Math.max(pad, Math.min(result.left, window.innerWidth - width - pad))),
		top: Math.round(Math.max(pad, Math.min(result.top, window.innerHeight - height - pad)))
	};
});
