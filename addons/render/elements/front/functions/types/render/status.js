elements.Fn('type.status', function(column, item)
{
	const config = column.config || {};
	const raw = column.id ? item[column.id] : undefined;

	const colors = elements.Fn('type.colors.status', config.colors);
	const key = raw ? String(raw).toLowerCase() : '';
	const color = colors[key] || config.color || 'neutral';
	const label = raw ? String(raw).charAt(0).toUpperCase() + String(raw).slice(1) : '—';

	return '<span class="ot-type-status color-' + color + '"><span class="ot-type-status-dot"></span>' + elements.Fn('type.escape', label) + '</span>';
});
