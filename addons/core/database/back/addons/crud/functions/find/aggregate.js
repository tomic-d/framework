import database from '#database/addon.js';
import crud from '#database/addons/crud/addon.js';

crud.Fn('aggregate', async function(query, type, field)
{
	crud.Fn('validate.field', field);

	field = database.Fn('column', query.addon, field);

	const result = await crud.Fn('execute', query, (knex) => knex[type](`${field} as result`), 0);

	return typeof result === 'number' ? result : parseFloat(result[0]?.result || 0);
});
