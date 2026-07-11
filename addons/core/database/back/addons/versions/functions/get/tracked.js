import onetype from '#framework/load.js';
import versions from '#database/addons/versions/addon.js';

versions.Fn('get.tracked', function(addon)
{
	const config = addon.Versions();

	if(!config)
	{
		return null;
	}

	/* virtual fields (join outputs) are not columns; versioning them would replay
	   them into UPDATE statements on restore */
	const skip = new Set(['id', 'created_at', 'updated_at']);
	const all = Object.values(addon.Fields().data)
		.filter((field) => !skip.has(field.name) && !onetype.DataParseConfig(field.define).virtual)
		.map((field) => field.name);

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
