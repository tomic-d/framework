import database from '#database/addon.js';
import crud from '#database/addons/crud/addon.js';

crud.Fn('fields.apply', function(item, record, skip = null)
{
	const data = database.Fn('cast', item.addon, record);

	Object.entries(data).forEach(([key, value]) =>
	{
		if(skip && skip.has(key))
		{
			return;
		}

		item.Set(key, value);
	});
});
