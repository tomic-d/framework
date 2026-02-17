import divhunt from '#framework/load.js';

divhunt.AddonReady('commands', (commands) =>
{
	commands.Item({
		id: 'database:query',
		exposed: true,
		method: 'POST',
		endpoint: '/api/database',
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
					type: 'object',
					config: 'join'
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
			limit: ['number', 50]
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
			this.validate = () =>
			{
				const addon = divhunt.Addon(properties.addon);

				if(!addon)
				{
					return { error: 'Addon not found.', code: 404 };
				}

				if(!addon.expose)
				{
					return { error: 'Addon is not exposed.', code: 403 };
				}

				return { addon, expose: addon.expose };
			};

			this.filter = (query, expose) =>
			{
				for(const filter of properties.filters)
				{
					if(!expose.filter.includes(filter.field))
					{
						return { error: 'Filter field "' + filter.field + '" is not allowed.', code: 400 };
					}

					query = query.filter(filter.field, filter.value, filter.operator || 'EQUALS');
				}

				return { query };
			};

			this.sort = (query, expose) =>
			{
				if(!expose.sort.includes(properties.sort_field))
				{
					return { error: 'Sort field "' + properties.sort_field + '" is not allowed.', code: 400 };
				}

				return { query: query.sort(properties.sort_field, properties.sort_direction || 'asc') };
			};

			this.join = (query, expose) =>
			{
				for(const join of properties.joins)
				{
					if(!expose.join || !expose.join.includes(join.addon))
					{
						return { error: 'Join addon "' + join.addon + '" is not allowed.', code: 400 };
					}

					query = query.join(join.addon, join.field, join.output || join.field);
				}

				return { query };
			};

			this.serialize = (items, expose) =>
			{
				return items.map(item =>
				{
					const data = item.Get(expose.select);

					if(properties.joins)
					{
						for(const join of properties.joins)
						{
							const output = join.output || join.field;
							const value = item.Get(output);

							if(!value)
							{
								data[output] = null;
								continue;
							}

							const target = divhunt.AddonGet(join.addon);
							const allowed = target?.expose?.select || Object.keys(target.Fields().data);
							const selected = join.select?.length
								? join.select.filter(field => allowed.includes(field))
								: allowed;

							const extract = (item) =>
							{
								if(item.Get) return item.Get(selected);

								const object = {};
								for(const field of selected) object[field] = item[field];
								return object;
							};

							data[output] = Array.isArray(value)
								? value.map(item => extract(item))
								: extract(value);
						}
					}

					return data;
				});
			};

			this.deep = async (items, name, depth = 0) =>
			{
				if(depth > 5 || !items.length)
				{
					return;
				}

				const addon = divhunt.AddonGet(name);
				const config = addon?.expose?.resolve;

				if(!config)
				{
					return;
				}

				for(const [field, target] of Object.entries(config))
				{
					const targetName = typeof target === 'string' ? target : target.addon;
					const targetAddon = divhunt.AddonGet(targetName);

					if(!targetAddon)
					{
						continue;
					}

					const fields = targetAddon?.expose?.select || Object.keys(targetAddon.Fields().data);
					const ids = [];

					for(const item of items)
					{
						const value = item[field];

						if(Array.isArray(value))
						{
							value.forEach(id =>
							{
								if(id && typeof id !== 'object' && !ids.includes(id))
								{
									ids.push(id);
								}
							});
						}
						else if(value && typeof value !== 'object' && !ids.includes(value))
						{
							ids.push(value);
						}
					}

					if(!ids.length)
					{
						continue;
					}

					const fetched = await targetAddon.Find().filter('id', ids, 'IN').limit(ids.length).many();
					const map = {};

					fetched.forEach(item =>
					{
						map[String(item.Get('id'))] = item.Get(fields);
					});

					for(const item of items)
					{
						const value = item[field];

						if(Array.isArray(value))
						{
							item[field] = value.map(id => typeof id === 'object' ? id : (map[String(id)] || null)).filter(Boolean);
						}
						else if(value && typeof value !== 'object')
						{
							item[field] = map[String(value)] || null;
						}
					}

					const nested = items.flatMap(item =>
					{
						const val = item[field];
						return Array.isArray(val) ? val : (val && typeof val === 'object' ? [val] : []);
					});

					if(nested.length)
					{
						await this.deep(nested, targetName, depth + 1);
					}
				}
			};

			const { addon, expose, error, code } = this.validate();

			if(error)
			{
				return resolve(null, error, code);
			}

			const select = properties.select?.length
				? properties.select.filter(field => expose.select.includes(field))
				: expose.select;

			let query = addon.Find();

			if(expose.callback)
			{
				expose.callback.call({http: this.http, properties}, query);
			}

			if(properties.filters)
			{
				const result = this.filter(query, expose);

				if(result.error)
				{
					return resolve(null, result.error, result.code);
				}

				query = result.query;
			}

			if(properties.sort_field)
			{
				const result = this.sort(query, expose);

				if(result.error)
				{
					return resolve(null, result.error, result.code);
				}

				query = result.query;
			}

			const limit = Math.min(properties.limit || 50, 500);
			const page = properties.page || 1;
			const total = await query.count();

			if(properties.joins)
			{
				const result = this.join(query, expose);

				if(result.error)
				{
					return resolve(null, result.error, result.code);
				}

				query = result.query;
			}

			const items = await query.page(page).limit(limit).many();
			const serialized = this.serialize(items, { ...expose, select });

			if(properties.joins)
			{
				for(const join of properties.joins)
				{
					const output = join.output || join.field;
					const nested = serialized.flatMap(item =>
					{
						const val = item[output];
						return Array.isArray(val) ? val : (val && typeof val === 'object' ? [val] : []);
					});

					if(nested.length)
					{
						await this.deep(nested, join.addon);
					}
				}
			}

			resolve({ items: serialized, total, page, limit });
		}
	});
});