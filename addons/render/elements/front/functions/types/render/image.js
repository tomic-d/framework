elements.Fn('type.image', function(column, item)
{
	const raw = column.id ? item[column.id] : undefined;
	const src = typeof raw === 'string' ? raw : (raw && raw.src);

	return src
		? '<div class="ot-type-image" style="background-image:url(\'' + elements.Fn('type.escape', src) + '\')"></div>'
		: '<div class="ot-type-image empty"></div>';
});
