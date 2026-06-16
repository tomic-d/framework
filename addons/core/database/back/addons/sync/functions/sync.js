import onetype from '#framework/load.js';
import database from '#database/addon.js';

/* Sync a connection's schema: ensure system tables, then every addon that has a
   Table() set (and either no pinned connection or one matching this item).
   Runs once per connection (guarded), idempotent. The promise is stored on the
   item as 'ready' so callers can await schema readiness before using it. */

database.Fn('sync', function(knex, item)
{
	const ready = (async () =>
	{
		await database.Fn('sync.system', knex);

		for(const addon of Object.values(onetype.Addons()))
		{
			if(typeof addon.Table !== 'function' || !addon.Table())
			{
				continue;
			}

			/* the database addon and its subaddons (database.versions, database.translations)
			   own their schema through sync.system, not the generic table sync */
			if(addon.GetName() === 'database' || addon.GetName().startsWith('database.'))
			{
				continue;
			}

			const config = addon.Table();

			if(config.connection && config.connection !== item.Get('id'))
			{
				continue;
			}

			await database.Fn('sync.table', knex, addon);
		}

		await onetype.Middleware('@database.sync', { knex, item });
	})();

	item.StoreSet('ready', ready);

	return ready;
});
