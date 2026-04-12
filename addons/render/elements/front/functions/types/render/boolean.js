elements.Fn('type.boolean', function(column, item)
{
	const raw = column.id ? item[column.id] : undefined;

	return raw
		? '<i class="ot-type-boolean yes">check_circle</i>'
		: '<i class="ot-type-boolean no">cancel</i>';
});
