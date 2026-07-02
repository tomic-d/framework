import sync from '#database/addons/sync/addon.js';

sync.Fn('get.foreign', async function(knex, table)
{
	this.methods.postgresql = async () =>
	{
		const rows = (await knex.raw(`
			select con.conname as name
			from pg_constraint con
			join pg_class rel on rel.oid = con.conrelid
			where con.contype = 'f' and rel.relname = ?`, [table])).rows;

		return rows.map((row) => row.name);
	};

	this.methods.mysql = async () =>
	{
		const rows = (await knex.raw(`
			select constraint_name as name
			from information_schema.table_constraints
			where table_schema = database() and table_name = ? and constraint_type = 'FOREIGN KEY'`, [table]))[0];

		return rows.map((row) => row.name);
	};

	this.methods.sqlite = async () =>
	{
		const list = await knex.raw(`PRAGMA foreign_key_list(??)`, [table]);

		return list.map((row) => `${table}_${row.from}_foreign`);
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
