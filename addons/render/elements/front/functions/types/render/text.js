elements.Fn('type.text', function(column, item)
{
	const config = column.config || {};
	const raw = column.id ? item[column.id] : undefined;
	const value = config.value !== undefined ? config.value : raw;

	return '<span class="ot-type-text">' + elements.Fn('type.escape', value === null || value === undefined || value === '' ? '—' : value) + '</span>';
});
