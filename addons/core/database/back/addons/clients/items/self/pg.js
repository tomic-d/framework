import clients from '../../addon.js';

clients.Item({
	id: 'pg',
	name: 'PostgreSQL',

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
		query[method + 'JsonSupersetOf'](field, Array.isArray(value) ? value : [value]);
	},

	dateTrunc(knex, interval, field)
	{
		return knex.raw('date_trunc(?, ??)', [interval, field]);
	},

	now(knex)
	{
		return knex.fn.now();
	}
});
