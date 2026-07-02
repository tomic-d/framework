import versions from '#database/addons/versions/addon.js';

versions.Fn('get.fold', async function(knex, addon, entityId, cutoff)
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

	rows.forEach((row) => versions.Fn('apply.fold', state, row));

	return { state, deleted: !!state[config.delete] };
});
