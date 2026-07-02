import database from '#database/addon.js';

database.Fn('serialize', function(value, type)
{
	if(value === null || value === undefined)
	{
		return value;
	}

	if((type === 'object' || type === 'array') && typeof value !== 'string')
	{
		return JSON.stringify(value);
	}

	return value;
});
