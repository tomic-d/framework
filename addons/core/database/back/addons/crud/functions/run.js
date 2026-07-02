import crud from '#database/addons/crud/addon.js';

crud.Fn('run', function(chain)
{
	return crud.Fn(chain.operation, chain);
});
