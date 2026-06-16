import database from '#database/addon.js';

/* Which declared key groups are missing from the real table. Compares each group
   against the introspected indexes of the matching kind (unique or plain) by
   column SET, since column order varies across engines. Returns groups to create. */

database.Fn('sync.keys', async function(knex, table, groups, unique)
{
	if(!groups.length)
	{
		return [];
	}

	const indexes = await database.Fn('sync.indexes', knex, table);
	const present = indexes.filter((index) => index.unique === unique).map((index) => [...index.columns].sort().join(','));

	return groups.filter((group) => !present.includes([...group].sort().join(',')));
});
