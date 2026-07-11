import database from '#database/addon.js';
import schema from '#database/addons/schema/addon.js';

/* A new connection syncs every schema addon registered so far. */

database.ItemOn('add', function(item)
{
	(schema.StoreGet('registered') || []).forEach((addon) => schema.Fn('queue', addon, item.Get('id')));
});
