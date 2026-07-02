import clients from '../../addon.js';

clients.Item({
	id: 'sqlite3',
	name: 'SQLite',

	stamp(date = new Date())
	{
		return date.toISOString();
	},

	async insert(trx, table, row)
	{
		const [record] = await trx(table).insert(row).returning('*');

		return record;
	},

	jsonContains(query, method, field, value)
	{
		query[method + 'Raw'](`EXISTS (SELECT 1 FROM json_each(??) WHERE json_each.value = ?)`, [field, Array.isArray(value) ? value[0] : value]);
	},

	dateTrunc(knex, interval, field)
	{
		const formats = {
			minute: '%Y-%m-%d %H:%M:00', hour: '%Y-%m-%d %H:00:00', day: '%Y-%m-%d 00:00:00',
			week: '%Y-%m-%d 00:00:00', month: '%Y-%m-01 00:00:00', year: '%Y-01-01 00:00:00'
		};

		return knex.raw('strftime(?, ??)', [formats[interval], field]);
	},

	now(knex)
	{
		return knex.fn.now();
	}
});
