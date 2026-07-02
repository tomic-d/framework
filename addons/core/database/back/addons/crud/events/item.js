import onetype from '#framework/load.js';
import crud from '#database/addons/crud/addon.js';

onetype.EmitOn('@addon.item.init', (item) =>
{
	item.Create = function({ connection = 'primary' } = {})
	{
		return crud.Fn('chain', 'create', { item, connection });
	};

	item.Update = function({ connection = 'primary' } = {})
	{
		return crud.Fn('chain', 'update', { item, connection });
	};

	item.Delete = function({ connection = 'primary' } = {})
	{
		return crud.Fn('chain', 'delete', { item, connection });
	};
});
