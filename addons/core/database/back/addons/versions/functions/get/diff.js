import versions from '#database/addons/versions/addon.js';

versions.Fn('get.diff', function(addon, before, after)
{
	const tracked = versions.Fn('get.tracked', addon);

	if(!tracked)
	{
		return null;
	}

	const changes = {};

	for(const field of tracked)
	{
		const old = before ? before[field] : undefined;
		const current = after ? after[field] : undefined;

		if(JSON.stringify(old) !== JSON.stringify(current))
		{
			changes[field] = { old: old ?? null, new: current ?? null };
		}
	}

	return Object.keys(changes).length ? changes : null;
});
