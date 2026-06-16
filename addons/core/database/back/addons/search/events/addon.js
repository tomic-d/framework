import onetype from '#framework/load.js';

/* The Search setter lives with the search subaddon: it marks which fields are
   matched by full-text search. Registered on @addon.init. */

onetype.EmitOn('@addon.init', (addon) =>
{
	addon.database.search = null;

	addon.Search = function(config)
	{
		if(config === undefined)
		{
			return addon.database.search;
		}

		addon.database.search = config;
	};
});
