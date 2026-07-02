import onetype from '#framework/load.js';
import crud from '#database/addons/crud/addon.js';

crud.Fn('validate.field', function(field)
{
	if(typeof field !== 'string' || !(/^[a-zA-Z][a-zA-Z0-9_\.]{0,63}$/.test(field)))
	{
		throw onetype.Error(400, 'Invalid field name :field:.', { field });
	}
});
