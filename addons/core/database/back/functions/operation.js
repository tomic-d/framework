import onetype from '#framework/load.js';
import database from '#database/addon.js';

/* Resolve a database operation's handler for a connection. The core does not know
   who implements operations: it emits @database.operation and whoever intercepts
   (the dialects registry) fills in the handler. Returns the handler to call, or
   throws if nothing claimed the operation. */

database.Fn('operation', async function(knex, name)
{
	const middleware = await onetype.Middleware('@database.operation', { knex, operation: name, handler: null });

	if(middleware.errors.length)
	{
		throw middleware.errors[0];
	}

	if(!middleware.value.handler)
	{
		throw onetype.Error(400, 'Database operation :1: is not supported.', name);
	}

	return middleware.value.handler;
});
