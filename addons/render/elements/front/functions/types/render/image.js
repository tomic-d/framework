elements.Fn('type.image', function(column, item)
{
	const config = column.config || {};
	const raw = column.id ? item[column.id] : undefined;
	const src = typeof raw === 'string' ? raw : (raw && raw.src);
	const fit = config.fit === 'cover' ? '' : ' contain';

	return src
		? '<div class="ot-type-image' + fit + '" style="background-image:url(\'' + elements.Fn('type.escape', src) + '\')"></div>'
		: '<div class="ot-type-image empty"></div>';
});
