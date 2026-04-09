import database from '#database/addon.js';

database.Fn('items.validation', function()
{
	const validation = {};

	validation.field = field =>
	{
		if(field === undefined || field === null)
		{
			throw new Error('Field name cannot be null or undefined');
		}

		if(typeof field !== 'string')
		{
			throw new Error(`Field name must be a string, received: ${typeof field}`);
		}

		if(!(/^[a-zA-Z][a-zA-Z0-9_\.]{0,63}$/.test(field)))
		{
			throw new Error(`Invalid field name format: '${field}'.`);
		}

		return true;
	};

	validation.fields = fields =>
	{
		if(!Array.isArray(fields))
		{
			throw new Error(`Fields must be an array, received: ${typeof fields}`);
		}

		if(fields.length === 0)
		{
			throw new Error('Fields array cannot be empty');
		}

		for(let i = 0; i < fields.length; i++)
		{
			validation.field(fields[i]);
		}

		return true;
	};

	validation.limit = limit =>
	{
		if(typeof limit !== 'number' || !Number.isInteger(limit) || limit <= 0)
		{
			throw new Error(`Limit must be a positive integer, received: ${limit}`);
		}

		return true;
	};

	validation.page = page =>
	{
		if(typeof page !== 'number' || !Number.isInteger(page) || page < 1)
		{
			throw new Error(`Page must be an integer >= 1, received: ${page}`);
		}

		return true;
	};

	validation.direction = direction =>
	{
		if(typeof direction !== 'string')
		{
			throw new Error(`Sort direction must be a string, received: ${typeof direction}`);
		}

		direction = direction.toLowerCase();

		if(!['asc', 'desc'].includes(direction))
		{
			throw new Error(`Invalid sort direction: '${direction}'.`);
		}

		return direction;
	};

	validation.operator = (operator, operators) =>
	{
		if(!operators.includes(operator.toUpperCase()))
		{
			throw new Error(`Invalid operator: '${operator}'.`);
		}

		return true;
	};

	validation.value = value =>
	{
		if(value !== null && !['number', 'string', 'boolean'].includes(typeof value))
		{
			throw new Error(`Value must be a string, number, or boolean. Received: ${typeof value}`);
		}

		return true;
	};

	validation.between = value =>
	{
		if(!Array.isArray(value) || value.length !== 2)
		{
			throw new Error('BETWEEN requires an array of exactly 2 elements.');
		}

		return true;
	};

	validation.inList = value =>
	{
		if(!Array.isArray(value) || value.length === 0)
		{
			throw new Error('IN requires a non-empty array.');
		}

		return true;
	};

	return validation;
});
