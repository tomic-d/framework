import onetype from '#framework/load.js';
import database from '#database/addon.js';

onetype.EmitOn('@addon.item.init', (item) =>
{
	item.Create = async function({connection = 'primary', translation = null} = {})
	{
		translation = onetype.LanguageValidate(translation || onetype.Language());

		return database.Fn('item.create', item, {connection, translation});
	};

	item.Update = async function({connection = 'primary', translation = null} = {})
	{
		translation = onetype.LanguageValidate(translation || onetype.Language());

		return database.Fn('item.update', item, {connection, translation});
	};

	item.Delete = async function({connection = 'primary'} = {})
	{
		return database.Fn('item.delete', item, {connection});
	};
});
