import onetype from '#framework/load.js';

/* The Translations setter lives with the translations subaddon: it marks which
   fields carry per-language values. Registered on @addon.init. */

onetype.EmitOn('@addon.init', (addon) =>
{
	addon.database.translations = null;

	addon.Translations = function(config)
	{
		if(config === undefined)
		{
			return addon.database.translations;
		}

		addon.database.translations = config;
	};
});
