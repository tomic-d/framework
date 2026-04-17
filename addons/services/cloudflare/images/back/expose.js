import images from '#cloudflare-images/addon.js';

images.Expose({
	filter: ['team_id', 'type'],
	sort: ['filename', 'created_at'],
	select: [
		'id', 'team_id', 'cloudflare_id', 'filename', 'url', 'variants', 'metadata', 'alt', 'size', 'type', 'width', 'height', 'updated_at', 'created_at'
	],
	find: function(query)
	{
		const user = this.http.state.user;

		if(!user || !user.team)
		{
			query.filter('id', null, 'NULL');
			return true;
		}

		query.filter('team_id', user.team.id);
		return true;
	},
	create: function()
	{
		const user = this.http.state.user;
		return user && user.team ? true : 'Not authenticated.';
	},
	update: function()
	{
		const user = this.http.state.user;
		return user && user.team ? true : 'Not authenticated.';
	},
	delete: function()
	{
		const user = this.http.state.user;
		return user && user.team ? true : 'Not authenticated.';
	}
});
