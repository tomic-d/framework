elements.Fn('type.currency', function(column, item)
{
	const config = column.config || {};
	const raw = column.id ? item[column.id] : undefined;

	return '<span class="ot-type-number">' + elements.Fn('type.escape', elements.Fn('type.format.currency', raw, config.currency)) + '</span>';
});
