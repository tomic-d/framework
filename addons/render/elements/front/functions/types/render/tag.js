elements.Fn('type.tag', function(column, item)
{
	const raw = column.id ? item[column.id] : undefined;

	return '<span class="ot-type-tag">' + elements.Fn('type.escape', raw === null || raw === undefined ? '—' : raw) + '</span>';
});
