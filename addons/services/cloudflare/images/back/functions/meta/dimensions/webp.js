import images from '#cloudflare-images/addon.js';

images.Fn('meta.dimensions.webp', function(buffer)
{
	const bytes = new Uint8Array(buffer);
	const view = new DataView(buffer.buffer || buffer);
	const chunk = String.fromCharCode(bytes[12], bytes[13], bytes[14], bytes[15]);

	if(chunk === 'VP8 ')
	{
		return {
			width: view.getUint16(26, true) & 0x3FFF,
			height: view.getUint16(28, true) & 0x3FFF
		};
	}

	if(chunk === 'VP8L')
	{
		const bits = view.getUint32(21, true);

		return {
			width: (bits & 0x3FFF) + 1,
			height: ((bits >> 14) & 0x3FFF) + 1
		};
	}

	if(chunk === 'VP8X')
	{
		return {
			width: (bytes[24] | (bytes[25] << 8) | (bytes[26] << 16)) + 1,
			height: (bytes[27] | (bytes[28] << 8) | (bytes[29] << 16)) + 1
		};
	}

	return { width: 0, height: 0 };
});
