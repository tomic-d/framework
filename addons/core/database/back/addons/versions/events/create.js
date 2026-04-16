import onetype from '#framework/load.js';
import versions from '../addon.js';

onetype.MiddlewareIntercept('@database.create', async (middleware) =>
{
	const { item, transaction, addon, language, languages } = middleware.value;

	if(!addon.Versions())
	{
		return await middleware.next();
	}

	const tracked = versions.Fn('tracked', addon);
	const after = {};

	for(const field of tracked)
	{
		try
		{
			after[field] = item.Get(field);
		}
		catch(error)
		{
			after[field] = null;
		}
	}

	const changes = versions.Fn('diff', addon, null, after);

	if(changes)
	{
		await transaction('database_versions').insert({
			addon: addon.name,
			entity_id: item.Get('id'),
			operation: 'create',
			changes,
			language: null
		});
	}

	const translation = language && languages && language !== languages[0];

	if(translation)
	{
		const fields = addon.Translations();

		if(fields && fields.length)
		{
			const translatable = fields.filter(f => tracked.includes(f));
			const changes = {};

			for(const field of translatable)
			{
				try
				{
					const value = item.Get(field);

					if(value !== null && value !== undefined)
					{
						changes[field] = { old: null, new: String(value) };
					}
				}
				catch(error) {}
			}

			if(Object.keys(changes).length)
			{
				await transaction('database_versions').insert({
					addon: addon.name,
					entity_id: item.Get('id'),
					operation: 'create',
					changes,
					language
				});
			}
		}
	}

	await middleware.next();
});
