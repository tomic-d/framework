import images from '#cloudflare-images/addon.js';

images.Fn('meta.dimensions.png', function(buffer)
{
	const view = new DataView(buffer.buffer || buffer);

	return {
		width: view.getUint32(16),
		height: view.getUint32(20)
	};
});
