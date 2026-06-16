import database from '#database/addon.js';

/* Write a DB record back onto the item, cast to declared field types,
   skipping fields that were not written. */

database.Fn('fields.apply', function(item, knex, record, skip = null)
{
	const data = database.Fn('cast', item.addon, knex, record);

	Object.entries(data).forEach(([key, value]) =>
	{
		if(skip && skip.has(key))
		{
			return;
		}

		item.Set(key, value);
	});
});
