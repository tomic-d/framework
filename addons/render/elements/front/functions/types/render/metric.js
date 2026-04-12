elements.Fn('type.metric', function(column, item)
{
	const raw = column.id ? item[column.id] : undefined;

	const value = typeof raw === 'object' && raw ? raw.value : raw;
	const delta = typeof raw === 'object' && raw ? raw.delta : null;
	const direction = delta && String(delta).startsWith('-') ? 'down' : 'up';

	return '<span class="ot-type-metric">'
		+ '<span class="ot-type-metric-value">' + elements.Fn('type.escape', value === null || value === undefined ? '—' : value) + '</span>'
		+ (delta ? '<span class="ot-type-metric-delta ' + direction + '">' + elements.Fn('type.escape', delta) + '</span>' : '')
	+ '</span>';
});
