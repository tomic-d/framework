import commands from '@onetype/framework/commands';
import images from '#cloudflare-images/addon.js';

commands.Item({
	id: 'cloudflare:images:upload',
	exposed: true,
	method: 'POST',
	endpoint: '/api/images',
	in: {
		site_id: ['string', null, true],
		file: ['binary', null, true],
		filename: ['string', null, true],
		alt: ['string']
	},
	out: {
		image: {
			type: 'object',
			config: {
				id: ['string'],
				team_id: ['string'],
				site_id: ['string'],
				cloudflare_id: ['string'],
				filename: ['string'],
				url: ['string'],
				variants: ['object'],
				alt: ['string'],
				size: ['number'],
				type: ['string'],
				width: ['number'],
				height: ['number'],
				updated_at: ['string'],
				created_at: ['string']
			}
		}
	},
	callback: async function(properties, resolve)
	{
		const user = this.http?.state?.user;

		if(!user || !user.team)
		{
			return resolve(null, 'Not authenticated.', 401);
		}

		const { file, filename, site_id, alt } = properties;
		const meta = images.Fn('meta', file);

		if(!meta.type)
		{
			return resolve(null, 'Unsupported image format.', 400);
		}

		const form = new FormData();

		form.append('file', new Blob([file]), filename);

		const result = await images.Fn('api', 'POST', '', form);

		const item = images.Item({
			team_id: user.team.id,
			site_id,
			cloudflare_id: result.id,
			filename,
			url: result.variants?.[0] || '',
			variants: result.variants || [],
			alt: alt || '',
			size: file.length,
			type: meta.type,
			width: meta.width,
			height: meta.height
		});

		await item.Create();

		resolve({
			image: item.Get(['id', 'team_id', 'site_id', 'cloudflare_id', 'filename', 'url', 'variants', 'alt', 'size', 'type', 'width', 'height', 'updated_at', 'created_at'])
		});
	}
});
