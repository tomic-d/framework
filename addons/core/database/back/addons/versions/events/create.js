import onetype from '#framework/load.js';
import versions from '#database/addons/versions/addon.js';

onetype.MiddlewareIntercept('@database.create.after', async (middleware) =>
{
	const { item, transaction, addon } = middleware.value;

	if(!addon.Versions())
	{
		return await middleware.next();
	}

	const language = middleware.value.language;
	const languages = middleware.value.languages;

	const tracked = versions.Fn('get.tracked', addon);
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

	const changes = versions.Fn('get.diff', addon, null, after);

	if(changes)
	{
		await versions.Fn('apply.write', transaction, addon, { entity: item.Get('id'), operation: 'create', changes });
	}

	const translation = language && languages && language !== languages[0];

	if(translation)
	{
		const fields = addon.Translations();

		if(fields && fields.length)
		{
			const translatable = fields.filter((field) => tracked.includes(field));
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
				await versions.Fn('apply.write', transaction, addon, { entity: item.Get('id'), operation: 'create', changes, language });
			}
		}
	}

	await middleware.next();
});
