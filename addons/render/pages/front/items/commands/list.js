onetype.AddonReady('commands', (commands) =>
{
	commands.Item({
		id: 'pages:list',
		method: 'GET',
		endpoint: '/api/pages/list',
		exposed: true,
		description: 'List all application pages with their routes and metadata',
		out: {
			pages: {
				type: 'array',
				each: {
					type: 'object',
					config: {
						id: ['string'],
						route: ['string|array'],
						meta: ['object'],
						'404': ['boolean']
					}
				}
			}
		},
		callback: function(properties, resolve)
		{
			const items = Object.values(pages.Items());

			resolve({
				pages: items.map(item =>
				({
					id: item.Get('id'),
					route: item.Get('route'),
					meta: item.Get('meta'),
					'404': item.Get('404')
				}))
			});
		}
	});
});
