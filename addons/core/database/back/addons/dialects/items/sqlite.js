import dialects from '../addon.js';

const formats = {
	minute: '%Y-%m-%d %H:%M:00', hour: '%Y-%m-%d %H:00:00', day: '%Y-%m-%d 00:00:00',
	week: '%Y-%m-%d 00:00:00', month: '%Y-%m-01 00:00:00', year: '%Y-01-01 00:00:00'
};

dialects.Item({
	dialect: 'sqlite3',
	operation: 'stamp',
	code: (date = new Date()) => date.toISOString()
});

dialects.Item({
	dialect: 'sqlite3',
	operation: 'insert',
	code: async (trx, table, row) =>
	{
		const [record] = await trx(table).insert(row).returning('*');

		return record;
	}
});

dialects.Item({
	dialect: 'sqlite3',
	operation: 'jsonContains',
	code: (query, method, field, value) => query[method + 'Raw'](`EXISTS (SELECT 1 FROM json_each(??) WHERE json_each.value = ?)`, [field, Array.isArray(value) ? value[0] : value])
});

dialects.Item({
	dialect: 'sqlite3',
	operation: 'dateTrunc',
	code: (knex, interval, field) => knex.raw('strftime(?, ??)', [formats[interval], field])
});

dialects.Item({
	dialect: 'sqlite3',
	operation: 'now',
	code: (knex) => knex.fn.now()
});
