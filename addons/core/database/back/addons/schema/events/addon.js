import onetype from '#framework/load.js';

/* The Schema setter collects raw pg DDL lines, one per call. A line is either a
   column definition ('views bigint default 0'), a table constraint ('primary key
   (entity, language)') or an index ('index (views)', 'unique (slug)'). */

onetype.EmitOn('@addon.init', (addon) =>
{
	addon.database.schema = [];

	addon.Schema = function(line)
	{
		if(line === undefined)
		{
			return addon.database.schema;
		}

		addon.database.schema.push(line);
	};

	addon.SchemaRun = function({ connection = 'primary' } = {})
	{
		return onetype.AddonGet('database.schema').Fn('run', addon, connection);
	};
});
