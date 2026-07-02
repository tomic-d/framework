import onetype from '#framework/load.js';
import crud from '#database/addons/crud/addon.js';

crud.Fn('validate.value', function(value)
{
	if(value !== null && !['number', 'string', 'boolean'].includes(typeof value))
	{
		throw onetype.Error(400, 'Value must be string, number, or boolean, got :type:.', { type: typeof value });
	}
});
