import onetype from '#framework/load.js';

/* item.History lives with versions: the version log of one entity. */

onetype.EmitOn('@addon.item.init', (item) =>
{
	item.History = function({connection = 'primary'} = {})
	{
		return onetype.AddonGet('database.versions').Fn('history', item.addon, item.Get('id'), {connection});
	};
});
