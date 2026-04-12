elements.Fn('type.group', function(column, item)
{
	const config = column.config || {};
	const layout = config.layout || 'row';
	const gap = config.gap || 'small';
	const fields = config.fields || [];

	return '<div class="ot-type-group layout-' + layout + ' gap-' + gap + '">'
		+ fields.map(field => elements.Fn('type.render', field, item)).join('')
	+ '</div>';
});
