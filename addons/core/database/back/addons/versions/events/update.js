import onetype from '#framework/load.js';
import database from '#database/addon.js';
import versions from '#database/addons/versions/addon.js';

onetype.MiddlewareIntercept('@database.update.before', async (middleware) =>
{
	const { item, transaction, addon } = middleware.value;

	if(!addon.Versions())
	{
		return await middleware.next();
	}

	const language = middleware.value.language;
	const languages = middleware.value.languages;
	const translation = language && languages && language !== languages[0];

	if(translation)
	{
		const fields = addon.Translations();
		const tracked = versions.Fn('get.tracked', addon);
		const translatable = (fields || []).filter((field) => tracked.includes(field));

		if(translatable.length)
		{
			const rows = await transaction('database_translations')
				.where({ entity: addon.name, entity_id: String(item.Get('id')), language })
				.whereIn('field', translatable);

			const existing = {};
			rows.forEach((row) => { existing[row.field] = row.value; });

			middleware.value.before = existing;
		}
	}
	else
	{
		const id = item.Get('id');
		const row = await transaction(addon.Table().name).where('id', id).first();

		middleware.value.before = row ? database.Fn('cast', addon, row) : null;
	}

	await middleware.next();
});

onetype.MiddlewareIntercept('@database.update.after', async (middleware) =>
{
	const { item, transaction, addon, before, skip } = middleware.value;

	if(!addon.Versions())
	{
		return await middleware.next();
	}

	const language = middleware.value.language;
	const languages = middleware.value.languages;
	const translation = language && languages && language !== languages[0];

	if(translation)
	{
		const fields = addon.Translations();
		const tracked = versions.Fn('get.tracked', addon);
		const whitelist = middleware.value.whitelist;
		const translatable = (fields || []).filter((field) => tracked.includes(field) && (!whitelist || whitelist.includes(field)));

		if(!translatable.length)
		{
			return await middleware.next();
		}

		const existing = before || {};
		const changes = {};

		for(const field of translatable)
		{
			let value = null;

			try
			{
				const current = item.Get(field);
				value = current !== null && current !== undefined ? String(current) : null;
			}
			catch(error) {}

			const old = existing[field] ?? null;

			if(old !== value)
			{
				changes[field] = { old, new: value };
			}
		}

		if(Object.keys(changes).length)
		{
			await versions.Fn('apply.write', transaction, addon, { entity: item.Get('id'), operation: 'update', changes, language });
		}

		return await middleware.next();
	}

	const tracked = versions.Fn('get.tracked', addon);
	const after = {};

	for(const field of tracked)
	{
		if(skip && skip.has(field))
		{
			after[field] = before ? before[field] : null;
			continue;
		}

		try
		{
			after[field] = item.Get(field);
		}
		catch(error)
		{
			after[field] = null;
		}
	}

	const changes = versions.Fn('get.diff', addon, before, after);

	if(changes)
	{
		await versions.Fn('apply.write', transaction, addon, { entity: item.Get('id'), operation: 'update', changes });
	}

	await middleware.next();
});
