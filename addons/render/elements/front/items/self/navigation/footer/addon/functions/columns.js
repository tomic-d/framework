footer.Fn('columns', function()
{
	const groups = footer.Fn('get', { type: 'column' });

	return groups.map(group =>
	({
		id: group.id,
		label: group.label,
		links: footer.Fn('get', { type: 'link', group: group.id })
	}));
});
