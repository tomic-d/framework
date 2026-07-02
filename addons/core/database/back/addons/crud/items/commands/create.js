import onetype from '#framework/load.js';

onetype.AddonReady('commands', (commands) =>
{
	commands.Item({
		id: 'database:create',
		exposed: true,
		method: 'POST',
		endpoint: '/api/database/create',
		in: {
			addon: ['string', null, true],
			data: ['object', null, true]
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

			const expose = addon.Expose();

			if(!expose)
			{
				return resolve(null, 'Addon is not exposed.', 403);
			}

			if(!expose.create)
			{
				return resolve(null, 'Create is not allowed.', 403);
			}

			const item = addon.Item(properties.data);
			const allowed = await expose.create.call({ http: this.http, properties, item });

			if(allowed !== true)
			{
				return resolve(null, typeof allowed === 'string' ? allowed : 'Create not allowed.', 400);
			}

			const created = await item.Create();
			const fields = expose.select || Object.keys(addon.Fields().data);

			resolve({ item: created.Get(fields) });
		}
	});
});
