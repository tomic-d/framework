elements.Fn('type.icon', function(column, item)
{
	const config = column.config || {};
	const raw = column.id ? item[column.id] : undefined;
	const value = config.value !== undefined ? config.value : raw;

	return value ? '<i class="ot-type-icon">' + elements.Fn('type.escape', value) + '</i>' : '';
});
