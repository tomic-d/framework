elements.Fn('type.media', function(column, item)
{
	const config = column.config || {};

	const image = item[config.image || 'image'];
	const title = item[config.title || 'name'] || '';
	const subtitle = item[config.subtitle || 'subtitle'] || '';

	return '<div class="ot-type-media">'
		+ (image ? '<div class="ot-type-media-thumb" style="background-image:url(\'' + elements.Fn('type.escape', image) + '\')"></div>' : '<div class="ot-type-media-thumb empty"><i>image</i></div>')
		+ '<div class="ot-type-media-info">'
			+ '<div class="ot-type-media-title">' + elements.Fn('type.escape', title) + '</div>'
			+ (subtitle ? '<div class="ot-type-media-subtitle">' + elements.Fn('type.escape', subtitle) + '</div>' : '')
		+ '</div>'
	+ '</div>';
});
