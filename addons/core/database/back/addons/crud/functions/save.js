import database from '#database/addon.js';

database.Fn('save', async function(item, {connection = 'primary', language = null, languages = null} = {})
{
	if(item.Get('id'))
	{
		return database.Fn('crud.update', item, {connection, language, languages});
	}

	return database.Fn('crud.create', item, {connection, language, languages});
});
