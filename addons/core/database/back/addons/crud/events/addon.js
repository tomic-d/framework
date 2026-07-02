import onetype from '#framework/load.js';
import crud from '#database/addons/crud/addon.js';

onetype.EmitOn('@addon.init', (addon) =>
{
	addon.database.expose = null;

	addon.Find = function({ connection = 'primary' } = {})
	{
		return crud.Fn('chain', 'find', { addon, connection });
	};

	addon.Expose = function(config)
	{
		if(config === undefined)
		{
			return addon.database.expose;
		}

		addon.database.expose = onetype.DataDefine(config,
		{
			filter: { type: 'array', value: [], each: { type: 'string' } },
			sort:   { type: 'array', value: [], each: { type: 'string' } },
			select: { type: 'array', value: [], each: { type: 'string' } },
			find:   { type: 'function' },
			create: { type: 'function' },
			update: { type: 'function' },
			delete: { type: 'function' }
		});
	};
});
