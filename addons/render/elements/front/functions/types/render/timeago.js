elements.Fn('type.timeago', function(column, item)
{
	const raw = column.id ? item[column.id] : undefined;

	return '<span class="ot-type-date">' + elements.Fn('type.escape', elements.Fn('type.format.timeago', raw)) + '</span>';
});
