import database from '#database/addon.js';

/* Serialize a value for writing: object/array fields become a JSON string
   (sqlite/mysql require it; pg jsonb accepts it too). Other types pass through. */

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
