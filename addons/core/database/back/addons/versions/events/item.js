import onetype from '#framework/load.js';

onetype.EmitOn('@addon.item.init', (item) =>
{
	item.History = function({ connection = 'primary' } = {})
	{
		return onetype.AddonGet('database.versions').Fn('get.history', item.addon, item.Get('id'), { connection });
	};
});
