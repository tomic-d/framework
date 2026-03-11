onetype.AddonReady('commands', (commands) =>
{
	commands.Item({
		id: 'pages:change',
		method: 'POST',
		endpoint: '/api/pages/change',
		exposed: true,
		description: 'Navigate to an application page by ID or path',
		in: {
			id: {
				type: 'string',
				description: 'Page ID to navigate to'
			},
			path: {
				type: 'string',
				description: 'URL path to navigate to'
			},
			parameters: {
				type: 'object',
				value: {},
				description: 'Route parameters'
			},
			push: {
				type: 'boolean',
				value: true,
				description: 'Push to browser history'
			}
		},
		out: {
			page: {
				type: 'object',
				config: {
					id: ['string'],
					route: ['string|array'],
					meta: ['object'],
					'404': ['boolean']
				}
			}
		},
		callback: async function(properties, resolve)
		{
			if(!properties.id && !properties.path)
			{
				resolve({ page: null });
				return;
			}

			const page = await pages.Fn('change', properties.id, properties.path, properties.parameters, properties.push);

			resolve({
				page: page ? {
					id: page.Get('id'),
					route: page.Get('route'),
					meta: page.Get('meta'),
					'404': page.Get('404')
				} : null
			});
		}
	});
});