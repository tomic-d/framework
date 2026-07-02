import onetype from '#framework/load.js';

onetype.EmitOn('@addon.init', (addon) =>
{
	addon.database = { table: null };

	addon.Table = function(value)
	{
		if(value === undefined)
		{
			return addon.database.table;
		}

		const table = addon.database.table = {};

		if(typeof value === 'function')
		{
			value({
				Name(name)
				{
					table.name = name;
				}
			});

			return;
		}

		table.name = value;
	};
});
