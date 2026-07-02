import database from '#database/addon.js';
import versions from '#database/addons/versions/addon.js';

versions.Fn('get.history', async function(addon, entity, { connection = 'primary' } = {})
{
	const knex = database.Fn('connection', connection);
	const query = knex('database_versions').where('addon', addon.name).orderBy('id', 'asc');

	if(entity !== null)
	{
		query.where('entity_id', entity);
	}

	return await query;
});
