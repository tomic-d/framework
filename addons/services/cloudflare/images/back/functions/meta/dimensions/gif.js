import images from '#cloudflare-images/addon.js';

images.Fn('meta.dimensions.gif', function(buffer)
{
	const view = new DataView(buffer.buffer || buffer);

	return {
		width: view.getUint16(6, true),
		height: view.getUint16(8, true)
	};
});
