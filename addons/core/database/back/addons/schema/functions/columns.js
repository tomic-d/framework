import schema from '../addon.js';

/* Read the exact shape of any relation's columns: format_type string, NOT NULL
   flag and default expression, straight from the catalog. Serial/identity
   defaults are reported as null — the sequence belongs to the column and is
   never compared or touched. */

schema.Fn('columns', async function(trx, relation)
{
	const rows = (await trx.raw(`
		select a.attname as name,
			format_type(a.atttypid, a.atttypmod) as type,
			a.attnotnull as required,
			pg_get_expr(d.adbin, d.adrelid) as value
		from pg_attribute a
		left join pg_attrdef d on d.adrelid = a.attrelid and d.adnum = a.attnum
		where a.attrelid = ?::regclass and a.attnum > 0 and not a.attisdropped`, [relation])).rows;

	const columns = {};

	rows.forEach((row) => columns[row.name] = {
		type: row.type,
		required: row.required,
		value: row.value && row.value.includes('nextval') ? null : row.value
	});

	return columns;
});
