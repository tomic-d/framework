import onetype from '#framework/load.js';

onetype.AddonReady('commands', (commands) =>
{
	commands.Item({
		id: 'database:restore',
		exposed: true,
		method: 'POST',
		endpoint: '/api/database/restore',
		in: {
			addon: ['string', null, true],
			version: ['number', null, true]
		},
		out: {
			restored: ['number']
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

			if(!expose.restore)
			{
				return resolve(null, 'Restore is not allowed.', 403);
			}

			const allowed = await expose.restore.call({ http: this.http, properties });

			if(allowed !== true)
			{
				return resolve(null, typeof allowed === 'string' ? allowed : 'Restore not allowed.', 400);
			}

			const result = await addon.Restore(properties.version);

			resolve(result);
		}
	});
});
