elements.Fn('type.progress', function(column, item)
{
	const config = column.config || {};
	const raw = column.id ? item[column.id] : undefined;

	const percent = Math.max(0, Math.min(100, Number(raw) || 0));
	const color = config.color || 'brand';

	return '<div class="ot-type-progress">'
		+ '<div class="ot-type-progress-track"><div class="ot-type-progress-bar color-' + elements.Fn('type.escape', color) + '" style="width:' + percent + '%"></div></div>'
		+ '<span class="ot-type-progress-label">' + percent + '%</span>'
	+ '</div>';
});
