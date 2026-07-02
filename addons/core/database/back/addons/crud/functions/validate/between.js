import onetype from '#framework/load.js';
import crud from '#database/addons/crud/addon.js';

crud.Fn('validate.between', function(value)
{
	if(!Array.isArray(value) || value.length !== 2)
	{
		throw onetype.Error(400, 'BETWEEN requires an array of exactly 2 elements.');
	}
});
