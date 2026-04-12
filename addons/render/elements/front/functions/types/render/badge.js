elements.Fn('type.badge', function(column, item)
{
	const config = column.config || {};
	const raw = column.id ? item[column.id] : undefined;

	const obj = (typeof raw === 'object' && raw) ? raw : { label: raw };
	const icon = obj.icon || '';
	const label = obj.label !== undefined ? obj.label : obj;
	const colors = elements.Fn('type.colors.badge', config.colors);
	const key = label ? String(label).toLowerCase() : '';
	const color = obj.color || colors[key] || config.color || 'neutral';

	return '<span class="ot-type-badge color-' + elements.Fn('type.escape', color) + '">'
		+ (icon ? '<i>' + elements.Fn('type.escape', icon) + '</i>' : '')
		+ '<span>' + elements.Fn('type.escape', label || '—') + '</span>'
	+ '</span>';
});
