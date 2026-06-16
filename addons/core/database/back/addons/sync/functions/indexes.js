import database from '#database/addon.js';

/* Introspect the existing indexes of a table as [{ name, columns, unique }].
   Dialect-specific (pg pg_index, mysql SHOW INDEX, sqlite PRAGMA), so unique
   diffing can compare what the database actually has against what is declared. */

database.Fn('sync.indexes', async function(knex, table)
{
	const name = knex.client.dialect;

	if(name === 'postgresql')
	{
		const rows = (await knex.raw(`
			select i.relname as name, a.attname as col, ix.indisunique as uniq
			from pg_class t
			join pg_index ix on t.oid = ix.indrelid
			join pg_class i on i.oid = ix.indexrelid
			join pg_attribute a on a.attrelid = t.oid and a.attnum = any(ix.indkey)
			where t.relname = ? and not ix.indisprimary`, [table])).rows;

		return group(rows.map((row) => ({ name: row.name, column: row.col, unique: row.uniq })));
	}

	if(name === 'mysql')
	{
		const rows = (await knex.raw('SHOW INDEX FROM ??', [table]))[0]
			.filter((row) => row.Key_name !== 'PRIMARY')
			.map((row) => ({ name: row.Key_name, column: row.Column_name, unique: row.Non_unique === 0 }));

		return group(rows);
	}

	const list = await knex.raw(`PRAGMA index_list(??)`, [table]);
	const indexes = [];

	for(const index of list)
	{
		const info = await knex.raw(`PRAGMA index_info(??)`, [index.name]);
		indexes.push({ name: index.name, columns: info.map((column) => column.name), unique: index.unique === 1 });
	}

	return indexes;
});

function group(rows)
{
	const map = {};

	for(const row of rows)
	{
		const index = map[row.name] || (map[row.name] = { name: row.name, columns: [], unique: row.unique });
		index.columns.push(row.column);
	}

	return Object.values(map);
}
