import images from '#cloudflare-images/addon.js';

images.Fn('meta.dimensions.jpeg', function(buffer)
{
	const bytes = new Uint8Array(buffer);
	let offset = 2;

	while(offset < bytes.length)
	{
		if(bytes[offset] !== 0xFF)
		{
			break;
		}

		const marker = bytes[offset + 1];

		if(marker >= 0xC0 && marker <= 0xCF && marker !== 0xC4 && marker !== 0xC8 && marker !== 0xCC)
		{
			return {
				width: (bytes[offset + 7] << 8) | bytes[offset + 8],
				height: (bytes[offset + 5] << 8) | bytes[offset + 6]
			};
		}

		const length = (bytes[offset + 2] << 8) | bytes[offset + 3];

		offset += 2 + length;
	}

	return { width: 0, height: 0 };
});
