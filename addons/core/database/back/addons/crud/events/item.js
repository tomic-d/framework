import onetype from '#framework/load.js';
import database from '#database/addon.js';

onetype.EmitOn('@addon.item.init', (item) =>
{
	item.Create = async function({connection = 'primary', language = null, languages = null} = {})
	{
		return database.Fn('crud.create', item, {connection, language, languages});
	};

	item.Update = async function({connection = 'primary', language = null, languages = null, whitelist = null} = {})
	{
		return database.Fn('crud.update', item, {connection, language, languages, whitelist});
	};

	item.Delete = async function({connection = 'primary'} = {})
	{
		return database.Fn('crud.delete', item, {connection});
	};
});
