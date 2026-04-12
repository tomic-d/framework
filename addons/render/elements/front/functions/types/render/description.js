elements.Fn('type.description', function(column, item)
{
	const config = column.config || {};
	const raw = column.id ? item[column.id] : undefined;
	const value = config.value !== undefined ? config.value : raw;
	const max = config.max || 70;

	const string = value === null || value === undefined || value === '' ? '—' : String(value);
	const truncated = string.length > max ? string.slice(0, max) + '…' : string;

	return '<span class="ot-type-description">' + elements.Fn('type.escape', truncated) + '</span>';
});
