elements.Fn('type.count', function(column, item)
{
	const config = column.config || {};
	const raw = column.id ? item[column.id] : undefined;
	const value = Array.isArray(raw) ? raw.length : (raw || 0);
	const label = config.label || '';

	return '<span class="ot-type-count">'
		+ '<span class="ot-type-count-value">' + elements.Fn('type.escape', String(value)) + '</span>'
		+ (label ? ' <span class="ot-type-count-label">' + elements.Fn('type.escape', label) + '</span>' : '')
	+ '</span>';
});
