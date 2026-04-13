import onetype from '#framework/load.js';

onetype.AddonReady('commands', (commands) =>
{
	commands.Item({
		id: 'database:batch',
		exposed: true,
		method: 'POST',
		endpoint: '/api/database/batch',
		in: {
			operations: {
				type: 'array',
				each: {
					type: 'object',
					config: {
						type: ['string', null, true],
						data: ['object', {}]
					}
				}
			}
		},
		out: {
			results: {
				type: 'array',
				each: {
					type: 'object'
				}
			}
		},
		callback: async function(properties, resolve)
		{
			const operations = properties.operations;

			if(!operations || !operations.length)
			{
				return resolve({ results: [] });
			}

			const map = {
				find: 'database:find',
				create: 'database:create',
				update: 'database:update',
				delete: 'database:delete'
			};

			const results = await Promise.all(operations.map(async (operation) =>
			{
				const id = map[operation.type];

				if(!id)
				{
					return { data: null, message: 'Unknown operation type.', code: 400 };
				}

				const command = commands.ItemGet(id);

				if(!command)
				{
					return { data: null, message: 'Command not found.', code: 404 };
				}

				try
				{
					const result = await command.Fn('run', operation.data, null, { http: this.http });

					return { data: result.data, message: result.message, code: result.code };
				}
				catch(error)
				{
					return { data: null, message: error.message, code: 500 };
				}
			}));

			resolve({ results });
		}
	});
});
