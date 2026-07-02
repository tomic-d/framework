import onetype from '#framework/load.js';
import crud from '#database/addons/crud/addon.js';

crud.Fn('hook', async function(name, context)
{
	const result = await onetype.Middleware(name, context);

	if(result.errors.length)
	{
		throw result.errors[0];
	}

	return result.value;
});
