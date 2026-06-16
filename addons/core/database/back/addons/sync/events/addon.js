import onetype from '#framework/load.js';

/* The schema-declaration setters live with the sync subaddon: they describe how a
   table is shaped (primary key, indexes, unique groups, relations) and only the
   sync addon acts on them. Registered on @addon.init so every addon gets them. */

onetype.EmitOn('@addon.init', (addon) =>
{
	addon.database.primary = { field: 'id', auto: true };
	addon.database.index = [];
	addon.database.unique = [];
	addon.database.relations = [];

	addon.Primary = function(field, options = {})
	{
		if(field === undefined)
		{
			return addon.database.primary;
		}

		addon.database.primary = { field, auto: options.auto !== false };
	};

	/* settled by column SET so a re-defined addon (idempotent Addon reuse) does not
	   accumulate duplicate key groups */
	const keyed = (list, fields) =>
	{
		const group = Array.isArray(fields) ? fields : [fields];
		const key = [...group].sort().join(',');

		if(!list.some((existing) => [...existing].sort().join(',') === key))
		{
			list.push(group);
		}
	};

	addon.Index = function(fields)
	{
		if(fields === undefined)
		{
			return addon.database.index;
		}

		keyed(addon.database.index, fields);
	};

	addon.Unique = function(fields)
	{
		if(fields === undefined)
		{
			return addon.database.unique;
		}

		keyed(addon.database.unique, fields);
	};

	addon.Relation = function(field, target, column = 'id')
	{
		if(field === undefined)
		{
			return addon.database.relations;
		}

		if(!addon.database.relations.some((relation) => relation.field === field && relation.addon === target && relation.column === column))
		{
			addon.database.relations.push({ field, addon: target, column });
		}
	};
});
