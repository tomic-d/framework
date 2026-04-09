import onetype from '#framework/load.js';

onetype.AddonReady('commands', (commands) =>
{
	commands.Item({
		id: 'database:update',
		exposed: true,
		method: 'POST',
		endpoint: '/api/database/update',
		in: {
			addon: ['string', null, true],
			id: ['string', null, true],
			data: ['object', null, true],
			translation: ['string']
		},
		out: {
			item: ['object']
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

			if(!expose.update)
			{
				return resolve(null, 'Update is not allowed.', 403);
			}

			if(!properties.data?.id || (typeof properties.data.id !== 'string' && typeof properties.data.id !== 'number'))
			{
				return resolve(null, 'Invalid or missing id.', 400);
			}

			const item = await addon.Find({translation: properties.translation}).filter('id', properties.data.id).one(true);

			if(!item)
			{
				return resolve(null, 'Item not found.', 404);
			}

			Object.entries(properties.data).forEach(([key, value]) =>
			{
				item.Set(key, value);
			});

			const allowed = expose.update.call({http: this.http, properties, item});

			if(allowed !== true)
			{
				return resolve(null, typeof allowed === 'string' ? allowed : 'Update not allowed.', 400);
			}

			await item.Update({translation: properties.translation});
			const fields = expose.select || Object.keys(addon.Fields().data);

			resolve({item: item.Get(fields)});
		}
	});
});
