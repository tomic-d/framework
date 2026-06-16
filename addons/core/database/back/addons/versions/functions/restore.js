import onetype from '#framework/load.js';
import database from '#database/addon.js';
import versions from '../addon.js';

/* Restore all of an addon's entities to a version cutoff (whole-site/table PITR).
   Entities created after the cutoff are soft-deleted; entities alive at the cutoff
   are folded back to their state at the cutoff. Append-only, so a restore is itself
   undoable by restoring to a later version. Multi-db (JS fold, no raw pivot). */

versions.Fn('restore', async function(addon, version, {connection = 'primary'} = {})
{
	const { knex, table } = database.Fn('connection', addon, connection);
	const stamp = await database.Fn('operation', knex, 'stamp');
	const config = addon.Versions();

	if(!config)
	{
		throw new Error(`Addon '${addon.name}' has no Versions() configured.`);
	}

	const tracked = versions.Fn('tracked', addon);

	return knex.transaction(async (transaction) =>
	{
		const created = (set) => transaction('database_versions').distinct('entity_id').where({ addon: addon.name, operation: 'create' }).whereNull('language').modify(set).pluck('entity_id');

		const all = await created(() => {});
		const aliveSet = new Set((await created((q) => q.where('id', '<=', version))).map(String));
		let restored = 0;

		for(const id of all)
		{
			const row = await transaction(table).where('id', id).first();

			if(!row)
			{
				continue;
			}

			/* cast to declared types before comparing: sqlite returns json columns as
			   strings, the folded target is parsed, so a raw compare would flag every
			   complex field as changed and log a spurious double-encoded version row */
			const current = database.Fn('cast', addon, transaction, row);

			/* created after the cutoff → soft-delete */
			if(!aliveSet.has(String(id)))
			{
				if(current[config.delete])
				{
					continue;
				}

				const now = stamp();
				const update = { [config.delete]: now, ...(addon.FieldGet('updated_at') ? { updated_at: now } : {}) };

				await transaction(table).where('id', id).update(update);
				await transaction('database_versions').insert({ addon: addon.name, entity_id: id, operation: 'update', changes: { [config.delete]: { old: null, new: now } }, language: null });
				restored++;
				continue;
			}

			/* alive at cutoff → fold to that state, update only what differs */
			const folded = await versions.Fn('fold', transaction, addon, id, version);

			if(!folded)
			{
				continue;
			}

			const state = folded.state;
			const update = {};
			const changes = {};

			for(const field of [...tracked, config.delete])
			{
				const target = state.hasOwnProperty(field) ? state[field] : null;
				const existing = current[field] instanceof Date ? current[field].toISOString() : (current[field] ?? null);
				const next = target instanceof Date ? target.toISOString() : target;

				if(JSON.stringify(existing) !== JSON.stringify(next))
				{
					const define = addon.FieldGet(field)?.define;
					update[field] = database.Fn('serialize', target, define ? onetype.DataParseConfig(define).type.split('|')[0] : 'string');
					changes[field] = { old: existing, new: next };
				}
			}

			if(!Object.keys(update).length)
			{
				continue;
			}

			if(addon.FieldGet('updated_at'))
			{
				update.updated_at = stamp();
			}

			await transaction(table).where('id', id).update(update);
			await transaction('database_versions').insert({ addon: addon.name, entity_id: id, operation: 'update', changes, language: null });
			restored++;
		}

		return { restored };
	});
});
