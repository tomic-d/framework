import database from '#database/addon.js';
import schema from '../addon.js';

database.Fn('ready', function()
{
	return schema.StoreGet('chain') || Promise.resolve();
});
