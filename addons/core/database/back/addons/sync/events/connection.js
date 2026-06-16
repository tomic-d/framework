import database from '#database/addon.js';

/* Auto-sync a connection the moment it is added: the core connection handler has
   already built the knex, so this runs after it (registration order) and brings
   every addon's table in line with its definition. Remove the sync subaddon and
   the core still connects; it just no longer auto-syncs. */

database.ItemOn('add', function(item)
{
	database.Fn('sync', item.Get('connection'), item);
});
