import onetype from '#framework/load.js';

onetype.EmitOn('@addon.init', (addon) =>
{
	addon.database = { table: null };

	addon.Table = function(name, options = {})
	{
		if(name === undefined)
		{
			return addon.database.table;
		}

		addon.database.table = { name, connection: options.connection || null, prune: options.prune === true };
	};
});
