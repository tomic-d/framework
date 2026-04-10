import onetype from '#framework/load.js';

onetype.AddonReady('commands', (commands) =>
{
	commands.Item({
		id: 'database:delete',
		exposed: true,
		method: 'POST',
		endpoint: '/api/database/delete',
		in: {
			addon: ['string', null, true],
			id: ['string', null, true]
		},
		out: {
			success: ['boolean']
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

			if(!expose.delete)
			{
				return resolve(null, 'Delete is not allowed.', 403);
			}

			if(!properties.id || (typeof properties.id !== 'string' && typeof properties.id !== 'number'))
			{
				return resolve(null, 'Invalid or missing id.', 400);
			}

			const item = await addon.Find().filter('id', properties.id).one(true);

			if(!item)
			{
				return resolve(null, 'Item not found.', 404);
			}

			const allowed = await expose.delete.call({http: this.http, properties, item});

			if(allowed !== true)
			{
				return resolve(null, typeof allowed === 'string' ? allowed : 'Delete not allowed.', 400);
			}

			await item.Delete();

			resolve({success: true});
		}
	});
});
