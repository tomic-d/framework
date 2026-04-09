import onetype from '#framework/load.js';

onetype.AddonReady('commands', (commands) =>
{
	commands.Item({
		id: 'database:find',
		exposed: true,
		method: 'POST',
		endpoint: '/api/database/find',
		in: {
			addon: ['string', null, true],
			filters: {
				type: 'array',
				each: {
					type: 'object',
					config: 'filter'
				}
			},
			sort_field: ['string'],
			sort_direction: ['string', 'asc'],
			select: {
				type: 'array',
				each: {
					type: 'string'
				}
			},
			page: ['number', 1],
			limit: ['number', 50],
			translation: ['string']
		},
		out: {
			items: {
				type: 'array',
				each: {
					type: 'object'
				}
			},
			total: ['number'],
			page: ['number'],
			limit: ['number']
		},
		callback: async function(properties, resolve)
		{
			const addon = onetype.AddonGet(properties.addon);

			if(!addon)
			{
				return resolve(null, 'Addon not found.', 404);
			}

			const expose = addon.database?.expose;

			if(!expose)
			{
				return resolve(null, 'Addon is not exposed.', 403);
			}

			let query = addon.Find({translation: properties.translation});

			if(properties.filters)
			{
				for(const filter of properties.filters)
				{
					if(!expose.filter.includes(filter.field))
					{
						return resolve(null, 'Filter field "' + filter.field + '" is not allowed.', 400);
					}

					query = query.filter(filter.field, filter.value, filter.operator || 'EQUALS');
				}
			}

			if(properties.sort_field)
			{
				if(!expose.sort.includes(properties.sort_field))
				{
					return resolve(null, 'Sort field "' + properties.sort_field + '" is not allowed.', 400);
				}

				query = query.sort(properties.sort_field, properties.sort_direction || 'asc');
			}

			if(expose.find)
			{
				const allowed = expose.find.call({http: this.http, properties}, query);

				if(allowed !== true)
				{
					return resolve(null, typeof allowed === 'string' ? allowed : 'Find not allowed.', 400);
				}
			}

			const limit = Math.min(properties.limit || 50, 500);
			const page = properties.page || 1;

			const result = await query.page(page).limit(limit).plain();

			if(expose.select)
			{
				const allowed = properties.select?.length ? properties.select.filter(field => expose.select.includes(field)) : expose.select;

				result.items = result.items.map(item =>
				{
					const data = {};

					for(const field of allowed)
					{
						data[field] = item[field];
					}

					return data;
				});
			}

			resolve(result);
		}
	});
});
