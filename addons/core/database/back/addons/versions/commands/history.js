import onetype from '#framework/load.js';

onetype.AddonReady('commands', (commands) =>
{
	commands.Item({
		id: 'database:history',
		exposed: true,
		method: 'POST',
		endpoint: '/api/database/history',
		in: {
			addon: ['string', null, true],
			entity: ['number|string']
		},
		out: {
			items: {
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

			if(!expose.history)
			{
				return resolve(null, 'History is not allowed.', 403);
			}

			let item = null;

			if(properties.entity)
			{
				item = await addon.Find().filter('id', properties.entity).one();

				if(!item)
				{
					return resolve(null, 'Item not found.', 404);
				}
			}

			const allowed = await expose.history.call({ http: this.http, properties, item });

			if(allowed !== true)
			{
				return resolve(null, typeof allowed === 'string' ? allowed : 'History not allowed.', 400);
			}

			const versions = onetype.AddonGet('database.versions');

			if(!versions)
			{
				return resolve(null, 'Versions not available.', 500);
			}

			const rows = await versions.Fn('history', addon, properties.entity || null);

			resolve({ items: rows });
		}
	});
});
