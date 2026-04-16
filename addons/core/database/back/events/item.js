import onetype from '#framework/load.js';
import database from '#database/addon.js';

onetype.EmitOn('@addon.item.init', (item) =>
{
	item.Create = async function({connection = 'primary', language = null, languages = null} = {})
	{
		return database.Fn('create', item, {connection, language, languages});
	};

	item.Update = async function({connection = 'primary', language = null, languages = null} = {})
	{
		return database.Fn('update', item, {connection, language, languages});
	};

	item.Delete = async function({connection = 'primary'} = {})
	{
		return database.Fn('delete', item, {connection});
	};

	item.History = function({connection = 'primary'} = {})
	{
		return onetype.AddonGet('database.versions').Fn('history', item.addon, item.Get('id'), {connection});
	};
});
