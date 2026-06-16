import dialects from '../addon.js';

dialects.Item({
	dialect: 'postgresql',
	operation: 'stamp',
	code: (date = new Date()) => date.toISOString()
});

dialects.Item({
	dialect: 'postgresql',
	operation: 'insert',
	code: async (trx, table, row) =>
	{
		const [record] = await trx(table).insert(row).returning('*');

		return record;
	}
});

dialects.Item({
	dialect: 'postgresql',
	operation: 'jsonContains',
	code: (query, method, field, value) => query[method + 'JsonSupersetOf'](field, Array.isArray(value) ? value : [value])
});

dialects.Item({
	dialect: 'postgresql',
	operation: 'dateTrunc',
	code: (knex, interval, field) => knex.raw('date_trunc(?, ??)', [interval, field])
});

dialects.Item({
	dialect: 'postgresql',
	operation: 'now',
	code: (knex) => knex.fn.now()
});
