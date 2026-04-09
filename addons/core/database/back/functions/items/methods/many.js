import database from '#database/addon.js';

database.Fn('items.methods.many', async function(query, set = false)
{
	let records = await database.Fn('items.methods.query', query);

	if(query.joins.length)
	{
		records = await database.Fn('items.transform.join', records, query.joins);
	}

	return records.map(data => query.addon.ItemAdd(data, null, false, set));
});
