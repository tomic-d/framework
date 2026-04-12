elements.Fn('type.tags', function(column, item)
{
	const raw = column.id ? item[column.id] : undefined;

	if(!Array.isArray(raw) || !raw.length)
	{
		return '<span class="ot-type-text">—</span>';
	}

	return '<div class="ot-type-tags">' + raw.map(tag => '<span class="ot-type-tag">' + elements.Fn('type.escape', tag) + '</span>').join('') + '</div>';
});
