import database from '#database/addon.js';
import versions from '../addon.js';

versions.Fn('history', async function(addon, entity, {connection = 'primary'} = {})
{
	const knex = database.ItemGet(connection)?.Get('connection');
	const query = knex('database_versions').where('addon', addon.name).orderBy('id', 'asc');

	if(entity !== null)
	{
		query.where('entity_id', entity);
	}

	return await query;
});
