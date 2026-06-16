import database from '#database/addon.js';

/* Normalize one DB value to a declared type (string/number/boolean/object/array).
   Per-type, engine-independent. This is the seam the casts registry will take
   over; for now it lives here so the dialects extraction stays self-contained. */

database.Fn('cast.value', function(value, type)
{
	if(value === null || value === undefined)
	{
		return value;
	}

	if(type === 'string')
	{
		return value instanceof Date ? value.toISOString() : String(value);
	}

	if(type === 'number')
	{
		return Number(value);
	}

	if(type === 'boolean')
	{
		return !!value;
	}

	if(type === 'object' || type === 'array')
	{
		if(typeof value !== 'string')
		{
			return value;
		}

		try
		{
			return JSON.parse(value);
		}
		catch(error)
		{
			return value;
		}
	}

	return value instanceof Date ? value.toISOString() : value;
});
