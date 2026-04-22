import onetype from '#framework/load.js';

function applyJoins(find, joins)
{
	if(!joins || !joins.length)
	{
		return;
	}

	for(const join of joins)
	{
		find.join(join.addon, join.field, join.output, (sub) =>
		{
			if(join.filters)
			{
				for(const filter of join.filters)
				{
					sub.filter(filter.field, filter.value, filter.operator || 'EQUALS');
				}
			}

			if(join.select)
			{
				sub.select(join.select);
			}

			if(join.sort)
			{
				sub.sort(join.sort.field, join.sort.direction || 'asc');
			}

			if(join.search)
			{
				sub.search(join.search);
			}

			if(join.joins)
			{
				applyJoins(sub, join.joins);
			}
		});
	}
}

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
			joins: {
				type: 'array',
				each: {
					type: 'object'
				}
			},
			search: ['string'],
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
			offset: ['number'],
			distinct: ['boolean', false],
			language: ['string'],
			version: ['number'],
			aggregate: ['object'],
			metrics: ['object']
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
			pages: ['number'],
			limit: ['number'],
			value: ['number'],
			data: {
				type: 'array',
				each: {
					type: 'object'
				}
			}
		},
		callback: async function(properties, resolve)
		{
			const addon = onetype.AddonGet(properties.addon);

			if(!addon)
			{
				return resolve(null, 'Addon not found.', 404);
			}

			const expose = addon.Expose();

			if(!expose)
			{
				return resolve(null, 'Addon is not exposed.', 403);
			}

			const language = properties.language || this.http?.state?.language || null;
			const languages = this.http?.state?.languages || null;

			const find = addon.Find({ language, languages });

			if(properties.filters)
			{
				for(const filter of properties.filters)
				{
					if(!expose.filter.includes(filter.field))
					{
						return resolve(null, 'Filter field "' + filter.field + '" is not allowed.', 400);
					}

					find.filter(filter.field, filter.value, filter.operator || 'EQUALS');
				}
			}

			if(properties.sort_field)
			{
				if(!expose.sort.includes(properties.sort_field))
				{
					return resolve(null, 'Sort field "' + properties.sort_field + '" is not allowed.', 400);
				}

				find.sort(properties.sort_field, properties.sort_direction || 'asc');
			}

			properties.search && find.search(properties.search);
			properties.distinct && find.distinct();
			properties.version && find.version(properties.version);
			properties.offset && find.offset(properties.offset);

			applyJoins(find, properties.joins);

			if(expose.find)
			{
				const allowed = expose.find.call({ http: this.http, properties }, find);

				if(allowed !== true)
				{
					return resolve(null, typeof allowed === 'string' ? allowed : 'Find not allowed.', 400);
				}
			}

			find.page(properties.page || 1).limit(Math.min(properties.limit || 50, 500));

			if(properties.aggregate)
			{
				const type = properties.aggregate.type;
				const field = properties.aggregate.field;

				if(!['sum', 'avg', 'min', 'max'].includes(type))
				{
					return resolve(null, 'Invalid aggregate type.', 400);
				}

				const value = await find[type](field);
				return resolve({ value });
			}

			if(properties.metrics)
			{
				const { field, interval, aggregate, value } = properties.metrics;
				const data = await find.metrics(field, interval, aggregate, value);
				return resolve(data);
			}

			const result = await find.plain();

			if(expose.select)
			{
				const allowed = properties.select?.length
					? properties.select.filter(field => expose.select.includes(field))
					: [...expose.select];

				if(properties.joins)
				{
					for(const join of properties.joins)
					{
						if(join.output && !allowed.includes(join.output))
						{
							allowed.push(join.output);
						}
					}
				}

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
