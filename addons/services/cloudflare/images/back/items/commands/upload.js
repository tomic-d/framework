import commands from '@onetype/framework/commands';
import images from '#cloudflare-images/addon.js';

commands.Item({
	id: 'cloudflare:images:upload',
	exposed: true,
	method: 'POST',
	endpoint: '/api/images',
	in: {
		file: ['binary'],
		url: ['string'],
		filename: ['string'],
		alt: ['string']
	},
	out: {
		image: {
			type: 'object',
			config: {
				id: ['string'],
				team_id: ['string'],
				metadata: ['object'],
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

		const { file, url, filename, alt } = properties;

		if(!file && !url)
		{
			return resolve(null, 'File or URL is required.', 400);
		}

		const form = new FormData();

		if(file)
		{
			form.append('file', new Blob([file]), filename || 'upload');
		}
		else
		{
			form.append('url', url);
		}

		const result = await images.Fn('api', 'POST', '', form);

		const meta = file ? images.Fn('meta', file) : { type: null, width: 0, height: 0 };
		const name = filename || (url ? url.split('?')[0].split('/').pop() : 'upload');

		const hash = process.env.CLOUDFLARE_IMAGES_HASH;
		const ext = meta.type ? meta.type.split('/')[1] : '';
		const image = 'https://images.onetype.ai/' + result.id + '/public' + (ext ? '#.' + ext : '');

		const item = images.Item({
			team_id: user.team.id,
			cloudflare_id: result.id,
			filename: name,
			url: hash ? image : (result.variants?.[0] || ''),
			variants: result.variants || [],
			metadata: {},
			alt: alt || '',
			size: file ? file.length : 0,
			type: meta.type || '',
			width: meta.width || 0,
			height: meta.height || 0
		});

		await item.Create();

		resolve({
			image: item.Get(['id', 'team_id', 'cloudflare_id', 'filename', 'url', 'variants', 'metadata', 'alt', 'size', 'type', 'width', 'height', 'updated_at', 'created_at'])
		});
	}
});
