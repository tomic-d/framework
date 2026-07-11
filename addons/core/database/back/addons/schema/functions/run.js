import onetype from '#framework/load.js';
import database from '#database/addon.js';
import schema from '../addon.js';

/* Idempotent DDL sync, one transaction per addon behind a global advisory lock:
   create the table when missing, add missing columns, retype mismatched ones,
   sync defaults and NOT NULL, drop columns no longer declared, ensure declared
   indexes and drop convention-named ones no longer declared. Errors (uncastable
   data, NOT NULL over nulls) roll the whole run back — that migration is manual.
   Safe to run on every boot. */

schema.Fn('run', async function(addon, connection = 'primary')
{
	const knex = database.Fn('connection', connection);
	const table = addon.Table().name;
	const { body, columns, indexes, clauses } = schema.Fn('parse', addon.Schema());

	if(!columns.length)
	{
		throw onetype.Error(400, 'Addon :addon: has no schema columns.', { addon: addon.name });
	}

	return knex.transaction(async (trx) =>
	{
		await trx.raw(`select pg_advisory_xact_lock(hashtext('onetype.schema'))`);
		await trx.raw(`CREATE TABLE IF NOT EXISTS ?? (${body.join(', ')}) ${clauses.join(' ')}`, [table]);

		const desired = await schema.Fn('describe', trx, body);
		const existing = await schema.Fn('columns', trx, table);

		for(const column of columns)
		{
			if(!(column.name in existing))
			{
				await trx.raw(`ALTER TABLE ?? ADD COLUMN ${column.line}`, [table]);
			}
			else if(desired[column.name].type !== existing[column.name].type)
			{
				const type = desired[column.name].type;

				await trx.raw(`ALTER TABLE ?? ALTER COLUMN ?? TYPE ${type} USING ??::${type}`, [table, column.name, column.name]);
			}
		}

		for(const name of Object.keys(existing))
		{
			if(!(name in desired))
			{
				await trx.raw(`ALTER TABLE ?? DROP COLUMN ??`, [table, name]);
			}
		}

		const current = await schema.Fn('columns', trx, table);

		for(const column of columns)
		{
			const target = desired[column.name];
			const live = current[column.name];

			if(target.value !== live.value)
			{
				await trx.raw(target.value === null
					? `ALTER TABLE ?? ALTER COLUMN ?? DROP DEFAULT`
					: `ALTER TABLE ?? ALTER COLUMN ?? SET DEFAULT ${target.value}`, [table, column.name]);
			}

			if(target.required !== live.required)
			{
				await trx.raw(`ALTER TABLE ?? ALTER COLUMN ?? ${target.required ? 'SET' : 'DROP'} NOT NULL`, [table, column.name]);
			}
		}

		const declared = indexes.map((index) => `${table}_${index.columns.join('_')}_${index.unique ? 'unique' : 'index'}`);

		for(const [position, index] of indexes.entries())
		{
			const list = index.columns.map(() => '??').join(', ');
			const method = index.method ? `USING ${index.method} ` : '';

			await trx.raw(`CREATE ${index.unique ? 'UNIQUE ' : ''}INDEX IF NOT EXISTS ?? ON ?? ${method}(${list})`, [declared[position], table, ...index.columns]);
		}

		const named = (await trx.raw(`select indexname from pg_indexes where schemaname = current_schema() and tablename = ?`, [table])).rows;

		for(const row of named)
		{
			const ours = row.indexname.startsWith(`${table}_`) && (row.indexname.endsWith('_index') || row.indexname.endsWith('_unique'));

			if(ours && !declared.includes(row.indexname))
			{
				await trx.raw(`DROP INDEX ??`, [row.indexname]);
			}
		}
	});
});
