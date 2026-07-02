import versions from '#database/addons/versions/addon.js';

versions.Fn('apply.fold', function(state, row)
{
	const changes = typeof row.changes === 'string' ? JSON.parse(row.changes) : row.changes;

	for(const field in changes)
	{
		state[field] = changes[field].new;
	}

	return state;
});
