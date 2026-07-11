import onetype from '#framework/load.js';
import metrics from '../addon.js';

/* Time-bucketed aggregation. Buckets via date_trunc; zero-fills gaps in JS
   (no generate_series). */

const STEP = {
	minute: 60000,
	hour: 3600000,
	day: 86400000,
	week: 604800000,
	month: null,
	year: null
};

const AGGREGATES = ['count', 'sum', 'avg', 'min', 'max'];

metrics.Fn('build', async function(knex, query, field, interval, aggregate, value)
{
	if(!(interval in STEP))
	{
		throw onetype.Error(400, 'Invalid interval :interval:. Must be one of :list:.', { interval, list: Object.keys(STEP).join(', ') });
	}

	const type = aggregate || 'count';

	if(!AGGREGATES.includes(type))
	{
		throw onetype.Error(400, 'Invalid aggregate :aggregate:. Must be one of :list:.', { aggregate: type, list: AGGREGATES.join(', ') });
	}
	const bucket = query.knex.raw('date_trunc(?, ??)', [interval, field]);
	const total = type === 'count' ? query.knex.raw('COUNT(*)') : query.knex.raw(`${type.toUpperCase()}(??)`, [value]);

	const rows = await knex
		.clear('select')
		.clear('order')
		.select({ date: bucket })
		.select({ value: total })
		.groupByRaw('1')
		.orderByRaw('1 ASC');

	if(!rows.length)
	{
		return [];
	}

	const map = {};

	rows.forEach((row) =>
	{
		map[new Date(row.date).toISOString()] = parseFloat(row.value) || 0;
	});

	const keys = Object.keys(map).sort();

	/* zero-fill empty buckets across the spanned range so the series is continuous */
	const result = [];
	const cursor = new Date(keys[0]);
	const last = new Date(keys[keys.length - 1]).getTime();

	while(cursor.getTime() <= last)
	{
		const current = cursor.toISOString();
		result.push({ date: current, value: map[current] || 0 });

		if(STEP[interval])
		{
			cursor.setTime(cursor.getTime() + STEP[interval]);
		}
		else if(interval === 'month')
		{
			cursor.setUTCMonth(cursor.getUTCMonth() + 1);
		}
		else
		{
			cursor.setUTCFullYear(cursor.getUTCFullYear() + 1);
		}
	}

	return result;
});
