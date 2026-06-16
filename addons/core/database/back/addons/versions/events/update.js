import onetype from '#framework/load.js';
import versions from '../addon.js';

onetype.MiddlewareIntercept('@database.update', async (middleware) =>
{
	const { item, transaction, addon, language, languages, before, skip } = middleware.value;

	if(!addon.Versions())
	{
		return await middleware.next();
	}

	const translation = language && languages && language !== languages[0];

	if(translation)
	{
		const fields = addon.Translations();

		if(!fields || !fields.length)
		{
			return await middleware.next();
		}

		const tracked = versions.Fn('tracked', addon);
		const translatable = fields.filter(f => tracked.includes(f));

		if(!translatable.length)
		{
			return await middleware.next();
		}

		const rows = await transaction('database_translations')
			.where({ entity: addon.name, entity_id: String(item.Get('id')), language })
			.whereIn('field', translatable);

		const existing = {};
		rows.forEach(row => { existing[row.field] = row.value; });

		await middleware.next();

		const after = {};

		for(const field of translatable)
		{
			try
			{
				const value = item.Get(field);

				if(value !== null && value !== undefined)
				{
					after[field] = String(value);
				}
			}
			catch(error) {}
		}

		const changes = {};

		for(const field of translatable)
		{
			const old = existing[field] ?? null;
			const current = after[field] ?? null;

			if(old !== current)
			{
				changes[field] = { old, new: current };
			}
		}

		if(Object.keys(changes).length)
		{
			await transaction('database_versions').insert({
				addon: addon.name,
				entity_id: item.Get('id'),
				operation: 'update',
				changes,
				language
			});
		}

		return;
	}

	const tracked = versions.Fn('tracked', addon);
	const after = {};

	/* a field the write path skipped (whitelist / per-field skip) was NOT persisted,
	   so its history must reflect the stored value, not the in-memory item value —
	   otherwise time-travel/Restore would replay a change that never hit the table */
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

	const changes = versions.Fn('diff', addon, before, after);

	if(changes)
	{
		await transaction('database_versions').insert({
			addon: addon.name,
			entity_id: item.Get('id'),
			operation: 'update',
			changes,
			language: null
		});
	}

	await middleware.next();
});
