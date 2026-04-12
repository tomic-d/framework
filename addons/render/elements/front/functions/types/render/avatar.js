elements.Fn('type.avatar', function(column, item)
{
	const raw = column.id ? item[column.id] : undefined;
	const src = typeof raw === 'string' ? raw : (raw && raw.src);
	const name = (raw && raw.name) || '';

	return src
		? '<div class="ot-type-avatar"><img src="' + elements.Fn('type.escape', src) + '" alt="' + elements.Fn('type.escape', name) + '"/></div>'
		: '<div class="ot-type-avatar ot-type-avatar-fallback"><i>person</i></div>';
});
