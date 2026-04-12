elements.Fn('type.color', function(column, item)
{
	const config = column.config || {};
	const raw = column.id ? item[column.id] : undefined;
	const value = config.value !== undefined ? config.value : raw;

	if(!value) return '';

	const escaped = elements.Fn('type.escape', value);

	return '<span class="ot-type-color">'
		+ '<span class="ot-type-color-swatch" style="background:' + escaped + '"></span>'
		+ '<span class="ot-type-color-value">' + escaped + '</span>'
	+ '</span>';
});
