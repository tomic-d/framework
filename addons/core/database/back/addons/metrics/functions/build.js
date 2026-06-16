import database from '#database/addon.js';
import metrics from '../addon.js';

/* Time-bucketed aggregation, multi-db. Buckets via dialect.dateTrunc (pg date_trunc,
   mysql DATE_FORMAT, sqlite strftime); zero-fills gaps in JS (no generate_series). */

const STEP = {
	minute: 60000,
	hour: 3600000,
	day: 86400000,
	week: 604800000,
	month: null,
	year: null
};

metrics.Fn('build', async function(knex, query, field, interval, aggregate, value)
{
	if(!(interval in STEP))
	{
		throw new Error(`Invalid interval '${interval}'. Must be: ${Object.keys(STEP).join(', ')}`);
	}

	const dateTrunc = await database.Fn('operation', query.knex, 'dateTrunc');
	const type = aggregate || 'count';
	const bucket = dateTrunc(query.knex, interval, field);
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
		const key = row.date instanceof Date ? row.date.toISOString() : String(row.date);
		map[key] = parseFloat(row.value) || 0;
	});

	const keys = Object.keys(map).sort();

	/* render a Date back into the same key shape the engine produced (pg: ISO with
	   'T'; mysql/sqlite: 'YYYY-MM-DD HH:MM:SS'), so synthesized gap buckets match.
	   parse keys as UTC: a space-form key has no zone and Date() would read it local. */
	const iso = keys[0].includes('T');
	const parse = (key) => new Date(iso ? key : key.replace(' ', 'T') + 'Z');
	const key = (date) => iso ? date.toISOString() : date.toISOString().slice(0, 19).replace('T', ' ');

	/* zero-fill empty buckets across the spanned range so the series is continuous */
	const result = [];
	const cursor = parse(keys[0]);
	const last = parse(keys[keys.length - 1]).getTime();

	while(cursor.getTime() <= last)
	{
		const current = key(cursor);
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
