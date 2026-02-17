sidebar.Fn('groups', function()
{
	const groups = sidebar.Fn('get', { type: 'group' });

	return groups.map(group => ({
		id: group.id,
		label: group.label,
		items: this.Fn('get', { type: 'item', group: group.id })
	}));
});
