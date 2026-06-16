import database from '#database/addon.js';
import versions from '../addon.js';

/* Reconstruct one entity's state at a version cutoff by folding its diff rows in
   JS (multi-db: no LATERAL / DISTINCT ON / jsonb pivot). Returns { state, deleted }
   or null if the entity never existed at the cutoff. */

versions.Fn('fold', async function(knex, addon, entityId, cutoff)
{
	const config = addon.Versions();

	const rows = await knex('database_versions')
		.where({ addon: addon.name, entity_id: String(entityId) })
		.whereNull('language')
		.andWhere('id', '<=', cutoff)
		.orderBy('id', 'asc');

	if(!rows.length)
	{
		return null;
	}

	const state = {};

	rows.forEach((row) => versions.Fn('fold.apply', state, row));

	return { state, deleted: !!state[config.delete] };
});
