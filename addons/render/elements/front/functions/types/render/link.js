elements.Fn('type.link', function(column, item)
{
	const raw = column.id ? item[column.id] : undefined;

	const obj = (typeof raw === 'object' && raw) ? raw : { label: raw, href: '#' };

	return '<a class="ot-type-link" href="' + elements.Fn('type.escape', obj.href || '#') + '">' + elements.Fn('type.escape', obj.label || raw || '—') + '</a>';
});
