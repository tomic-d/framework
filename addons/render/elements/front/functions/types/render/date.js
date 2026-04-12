elements.Fn('type.date', function(column, item)
{
	const raw = column.id ? item[column.id] : undefined;

	return '<span class="ot-type-date">' + elements.Fn('type.escape', elements.Fn('type.format.date', raw)) + '</span>';
});
