import commands from '@onetype/framework/commands';
import images from '#cloudflare-images/addon.js';

commands.Item({
	id: 'cloudflare:images:delete',
	exposed: true,
	method: 'DELETE',
	endpoint: '/api/images',
	in: {
		id: ['string', null, true]
	},
	callback: async function(properties, resolve)
	{
		const user = this.http?.state?.user;

		if(!user || !user.team)
		{
			return resolve(null, 'Not authenticated.', 401);
		}

		const item = images.Item(properties.id);

		if(!item)
		{
			return resolve(null, 'Image not found.', 404);
		}

		if(item.Get('team_id') !== user.team.id)
		{
			return resolve(null, 'Not authorized.', 403);
		}

		await images.Fn('api', 'DELETE', '/' + item.Get('cloudflare_id'));
		await item.Delete();

		resolve(null, 'Image deleted.');
	}
});
