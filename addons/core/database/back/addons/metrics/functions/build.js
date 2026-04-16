import metrics from '../addon.js';

metrics.Fn('build', async function(knex, query, field, interval, aggregate, value)
{
	const intervals = {
		minute: '1 minute',
		hour: '1 hour',
		day: '1 day',
		week: '1 week',
		month: '1 month',
		year: '1 year'
	};

	if(!intervals[interval])
	{
		throw new Error(`Invalid interval '${interval}'. Must be: ${Object.keys(intervals).join(', ')}`);
	}

	const type = aggregate || 'count';
	const expression = type === 'count'
		? query.knex.raw('COUNT(*)')
		: query.knex.raw(`${type.toUpperCase()}(??)`, [value]);

	const rows = await knex
		.clear('select')
		.clear('order')
		.select(query.knex.raw('date_trunc(?, ??) AS date', [interval, field]))
		.select(query.knex.raw(`${expression} AS value`))
		.groupByRaw('1')
		.orderByRaw('date ASC');

	if(!rows.length)
	{
		return [];
	}

	const map = {};

	rows.forEach(row =>
	{
		const key = row.date instanceof Date ? row.date.toISOString() : row.date;
		map[key] = parseFloat(row.value) || 0;
	});

	const dates = rows.map(row => row.date instanceof Date ? row.date : new Date(row.date));

	const filled = await query.knex.raw(`
		SELECT d::timestamptz AS date
		FROM generate_series(?::timestamptz, ?::timestamptz, ?::interval) AS d
	`, [dates[0], dates[dates.length - 1], intervals[interval]]);

	return filled.rows.map(row =>
	{
		const key = row.date instanceof Date ? row.date.toISOString() : row.date;
		return { date: key, value: map[key] || 0 };
	});
});
