import database from '#database/addon.js';
import versions from '../addon.js';

/* Fold every entity at once (whole-table time-travel). One query, grouped in JS.
   Returns a map entity_id -> state for entities alive at the cutoff. */

versions.Fn('fold.many', async function(knex, addon, cutoff)
{
	const config = addon.Versions();

	const rows = await knex('database_versions')
		.where({ addon: addon.name })
		.whereNull('language')
		.andWhere('id', '<=', cutoff)
		.orderBy('id', 'asc');

	const byEntity = {};

	rows.forEach((row) =>
	{
		const state = byEntity[row.entity_id] || (byEntity[row.entity_id] = {});
		versions.Fn('fold.apply', state, row);
	});

	const alive = {};

	for(const [entityId, state] of Object.entries(byEntity))
	{
		if(!state[config.delete])
		{
			alive[entityId] = state;
		}
	}

	return alive;
});
