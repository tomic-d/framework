import database from '#database/addon.js';

/* Compare desired columns (from field definitions) against the real table.
   Returns columns missing (to add), extra (in DB, not in schema), and mismatched
   (object/array fields whose real column is not a JSON type — e.g. a native array
   left over from before auto-sync). Type changes are never applied automatically. */

database.Fn('sync.diff', async function(knex, table, columns)
{
	const info = await knex(table).columnInfo();
	const existing = new Set(Object.keys(info));
	const desired = new Set(columns.map((column) => column.name));

	const missing = columns.filter((column) => !existing.has(column.name));
	const extra = [...existing].filter((name) => !desired.has(name));

	const mismatched = columns.filter((column) =>
	{
		if(!existing.has(column.name) || (column.type !== 'object' && column.type !== 'array'))
		{
			return false;
		}

		return !String(info[column.name].type).toLowerCase().includes('json');
	}).map((column) => column.name);

	return { missing, extra, mismatched };
});
