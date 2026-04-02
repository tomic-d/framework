import images from '#cloudflare-images/addon.js';

images.Fn('meta', function(buffer)
{
	const type = this.Fn('meta.detect', buffer);

	if(!type)
	{
		return { type: null, width: 0, height: 0 };
	}

	const format = type.split('/')[1];
	const dimensions = this.Fn('meta.dimensions.' + format, buffer);

	return { type, width: dimensions.width, height: dimensions.height };
});
