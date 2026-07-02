import sync from '#database/addons/sync/addon.js';

sync.Fn('get.indexes', async function(knex, table)
{
	this.methods.group = (rows) =>
	{
		const map = {};

		for(const row of rows)
		{
			const index = map[row.name] || (map[row.name] = { name: row.name, columns: [], unique: row.unique });
			index.columns.push(row.column);
		}

		return Object.values(map);
	};

	this.methods.postgresql = async () =>
	{
		const rows = (await knex.raw(`
			select i.relname as name, a.attname as col, ix.indisunique as uniq
			from pg_class t
			join pg_index ix on t.oid = ix.indrelid
			join pg_class i on i.oid = ix.indexrelid
			join pg_attribute a on a.attrelid = t.oid and a.attnum = any(ix.indkey)
			where t.relname = ? and not ix.indisprimary`, [table])).rows;

		return this.methods.group(rows.map((row) => ({ name: row.name, column: row.col, unique: row.uniq })));
	};

	this.methods.mysql = async () =>
	{
		const rows = (await knex.raw('SHOW INDEX FROM ??', [table]))[0]
			.filter((row) => row.Key_name !== 'PRIMARY')
			.map((row) => ({ name: row.Key_name, column: row.Column_name, unique: row.Non_unique === 0 }));

		return this.methods.group(rows);
	};

	this.methods.sqlite = async () =>
	{
		const list = await knex.raw(`PRAGMA index_list(??)`, [table]);
		const indexes = [];

		for(const index of list)
		{
			const info = await knex.raw(`PRAGMA index_info(??)`, [index.name]);
			indexes.push({ name: index.name, columns: info.map((column) => column.name), unique: index.unique === 1 });
		}

		return indexes;
	};

	const dialect = knex.client.dialect;

	if(dialect === 'postgresql')
	{
		return this.methods.postgresql();
	}

	if(dialect === 'mysql')
	{
		return this.methods.mysql();
	}

	return this.methods.sqlite();
});
