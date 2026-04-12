elements.Fn('type.number', function(column, item)
{
	const raw = column.id ? item[column.id] : undefined;

	return '<span class="ot-type-number">' + elements.Fn('type.escape', elements.Fn('type.format.number', raw)) + '</span>';
});
