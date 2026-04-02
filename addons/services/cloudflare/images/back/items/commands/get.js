import commands from '@onetype/framework/commands';
import images from '#cloudflare-images/addon.js';

commands.Item({
	id: 'cloudflare:images:get',
	exposed: true,
	method: 'GET',
	endpoint: '/api/images/:id',
	in: {
		id: ['string', null, true]
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

		const item = await images.Find()
			.filter('id', properties.id)
			.filter('team_id', user.team.id)
			.one();

		if(!item)
		{
			return resolve(null, 'Image not found.', 404);
		}

		resolve({
			image: item.Get(['id', 'team_id', 'site_id', 'cloudflare_id', 'filename', 'url', 'variants', 'alt', 'size', 'type', 'width', 'height', 'updated_at', 'created_at'])
		});
	}
});
