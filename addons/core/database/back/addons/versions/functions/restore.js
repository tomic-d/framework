import onetype from '#framework/load.js';
import database from '#database/addon.js';
import versions from '../addon.js';

versions.Fn('restore', async function(addon, version, {connection = 'primary'} = {})
{
	const { knex, table } = database.Fn('connection', addon, connection);
	const config = addon.Versions();

	if(!config)
	{
		throw new Error(`Addon '${addon.name}' has no Versions() configured.`);
	}

	const tracked = versions.Fn('tracked', addon);

	return knex.transaction(async (transaction) =>
	{
		const all = await transaction('database_versions')
			.distinct('entity_id')
			.where({ addon: addon.name, operation: 'create' })
			.whereNull('language')
			.pluck('entity_id');

		const alive = await transaction('database_versions')
			.distinct('entity_id')
			.where({ addon: addon.name, operation: 'create' })
			.whereNull('language')
			.where('id', '<=', version)
			.pluck('entity_id');

		const aliveSet = new Set(alive.map(String));
		let restored = 0;

		for(const id of all)
		{
			if(aliveSet.has(String(id)))
			{
				continue;
			}

			const current = await transaction(table).where('id', id).first();

			if(!current || current[config.delete])
			{
				continue;
			}

			const now = new Date().toISOString();

			await transaction(table).where('id', id).update({
				[config.delete]: now,
				...(addon.FieldGet('updated_at') ? { updated_at: now } : {})
			});

			await transaction('database_versions').insert({
				addon: addon.name,
				entity_id: id,
				operation: 'update',
				changes: { [config.delete]: { old: null, new: now } },
				language: null
			});

			restored++;
		}

		for(const id of alive)
		{
			const rows = await transaction('database_versions')
				.where({ addon: addon.name, entity_id: id })
				.whereNull('language')
				.where('id', '<=', version)
				.orderBy('id', 'asc');

			if(!rows.length)
			{
				continue;
			}

			const state = {};

			for(const row of rows)
			{
				Object.entries(row.changes).forEach(([field, change]) =>
				{
					state[field] = change.new;
				});
			}

			const current = await transaction(table).where('id', id).first();

			if(!current)
			{
				continue;
			}

			const update = {};
			const changes = {};

			for(const field of tracked)
			{
				const target = state.hasOwnProperty(field) ? state[field] : null;
				const existing = current[field] ?? null;

				const a = existing instanceof Date ? existing.toISOString() : existing;
				const b = target instanceof Date ? target.toISOString() : target;

				if(JSON.stringify(a) !== JSON.stringify(b))
				{
					update[field] = target;
					changes[field] = { old: a, new: b };
				}
			}

			const deleted = state[config.delete] ?? null;
			const current_deleted = current[config.delete] ?? null;
			const a = current_deleted instanceof Date ? current_deleted.toISOString() : current_deleted;

			if(a !== deleted)
			{
				update[config.delete] = deleted;
				changes[config.delete] = { old: a, new: deleted };
			}

			if(!Object.keys(update).length)
			{
				continue;
			}

			if(addon.FieldGet('updated_at'))
			{
				update.updated_at = new Date().toISOString();
			}

			await transaction(table).where('id', id).update(update);

			await transaction('database_versions').insert({
				addon: addon.name,
				entity_id: id,
				operation: 'update',
				changes,
				language: null
			});

			restored++;
		}

		return { restored };
	});
});
