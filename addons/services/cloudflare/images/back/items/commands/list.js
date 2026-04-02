import commands from '@onetype/framework/commands';
import images from '#cloudflare-images/addon.js';

commands.Item({
	id: 'cloudflare:images:list',
	exposed: true,
	method: 'GET',
	endpoint: '/api/images',
	in: {
		site_id: ['string', null, true],
		page: ['number'],
		limit: ['number']
	},
	out: {
		images: ['array', null, true],
		total: ['number']
	},
	callback: async function(properties, resolve)
	{
		const user = this.http?.state?.user;

		if(!user || !user.team)
		{
			return resolve(null, 'Not authenticated.', 401);
		}

		const query = images.Find()
			.filter('team_id', user.team.id)
			.filter('site_id', properties.site_id)
			.sort('created_at', 'desc');

		if(properties.limit)
		{
			query.limit(properties.limit);
		}

		if(properties.page)
		{
			query.page(properties.page);
		}

		const result = await query.plain();

		resolve({
			images: result.items,
			total: result.total
		});
	}
});
