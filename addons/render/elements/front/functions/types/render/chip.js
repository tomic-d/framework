elements.Fn('type.chip', function(column, item)
{
	const raw = column.id ? item[column.id] : undefined;

	return '<span class="ot-type-chip">' + elements.Fn('type.escape', raw === null || raw === undefined ? '—' : raw) + '</span>';
});
