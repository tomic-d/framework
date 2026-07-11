import onetype from '#framework/load.js';
import database from '#database/addon.js';
import schema from '../addon.js';

/* Every addon that declares Table + Schema queues its DDL against the live
   connections the moment it is added. */

onetype.EmitOn('@addon.add', (addon) =>
{
	if(!addon.Table || !addon.Table() || !addon.Schema().length)
	{
		return;
	}

	const registered = schema.StoreGet('registered') || [];

	registered.push(addon);
	schema.StoreSet('registered', registered);

	Object.keys(database.Items()).forEach((connection) => schema.Fn('queue', addon, connection));
});
