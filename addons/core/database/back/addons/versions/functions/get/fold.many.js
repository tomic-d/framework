import versions from '#database/addons/versions/addon.js';

versions.Fn('get.fold.many', async function(knex, addon, cutoff)
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
		versions.Fn('apply.fold', state, row);
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
