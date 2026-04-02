import images from '#cloudflare-images/addon.js';

images.Expose({
	filter: ['team_id', 'site_id', 'type'],
	sort: ['filename', 'created_at'],
	select: [
		'id', 'team_id', 'site_id', 'cloudflare_id', 'filename', 'url', 'variants', 'alt', 'size', 'type', 'width', 'height', 'updated_at', 'created_at'
	],
	callback: function(query)
	{
		const user = this.http.state.user;

		if(user)
		{
			query.filter('team_id', user.team.id);
		}
		else
		{
			query.filter('id', null, 'NULL');
		}
	}
});
