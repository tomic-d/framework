import dialects from '../addon.js';

const formats = {
	minute: '%Y-%m-%d %H:%i:00', hour: '%Y-%m-%d %H:00:00', day: '%Y-%m-%d 00:00:00',
	month: '%Y-%m-01 00:00:00', year: '%Y-01-01 00:00:00'
};

dialects.Item({
	dialect: 'mysql',
	operation: 'stamp',
	code: (date = new Date()) => date.toISOString().slice(0, 19).replace('T', ' ')
});

dialects.Item({
	dialect: 'mysql',
	operation: 'insert',
	code: async (trx, table, row) =>
	{
		const [id] = await trx(table).insert(row);

		return trx(table).where('id', id).first();
	}
});

dialects.Item({
	dialect: 'mysql',
	operation: 'jsonContains',
	code: (query, method, field, value) => query[method + 'Raw']('JSON_CONTAINS(??, ?)', [field, JSON.stringify(Array.isArray(value) ? value[0] : value)])
});

dialects.Item({
	dialect: 'mysql',
	operation: 'dateTrunc',
	code: (knex, interval, field) =>
	{
		if(interval === 'week')
		{
			return knex.raw('DATE_FORMAT(DATE_SUB(??, INTERVAL WEEKDAY(??) DAY), ?)', [field, field, '%Y-%m-%d 00:00:00']);
		}

		return knex.raw('DATE_FORMAT(??, ?)', [field, formats[interval]]);
	}
});

dialects.Item({
	dialect: 'mysql',
	operation: 'now',
	code: (knex) => knex.fn.now()
});
