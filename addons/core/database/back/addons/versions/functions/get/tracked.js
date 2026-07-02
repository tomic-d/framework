import versions from '#database/addons/versions/addon.js';

versions.Fn('get.tracked', function(addon)
{
	const config = addon.Versions();

	if(!config)
	{
		return null;
	}

	const skip = new Set(['id', 'created_at', 'updated_at']);
	const all = Object.keys(addon.Fields().data).filter((name) => !skip.has(name));

	if(!config.fields)
	{
		return all;
	}

	if(config.invert)
	{
		return all.filter((name) => !config.fields.includes(name));
	}

	return all.filter((name) => config.fields.includes(name));
});
