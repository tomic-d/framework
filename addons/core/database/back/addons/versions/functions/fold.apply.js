import versions from '../addon.js';

/* Apply one version row's changes onto a state object. Every operation stores
   changes as {field:{old,new}} (create/update/restore alike), so we take .new. */

versions.Fn('fold.apply', function(state, row)
{
	const changes = typeof row.changes === 'string' ? JSON.parse(row.changes) : row.changes;

	for(const field in changes)
	{
		state[field] = changes[field].new;
	}

	return state;
});
