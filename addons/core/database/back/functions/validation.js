import database from '#database/addon.js';

database.Fn('validation', function()
{
	const validation = {};

	validation.field = (field) =>
	{
		if(typeof field !== 'string' || !(/^[a-zA-Z][a-zA-Z0-9_\.]{0,63}$/.test(field)))
		{
			throw new Error(`Invalid field name: '${field}'.`);
		}
	};

	validation.fields = (fields) =>
	{
		if(!Array.isArray(fields) || !fields.length)
		{
			throw new Error('Fields must be a non-empty array.');
		}

		fields.forEach(validation.field);
	};

	validation.limit = (limit) =>
	{
		if(typeof limit !== 'number' || !Number.isInteger(limit) || limit <= 0)
		{
			throw new Error(`Limit must be a positive integer, received: ${limit}`);
		}
	};

	validation.page = (page) =>
	{
		if(typeof page !== 'number' || !Number.isInteger(page) || page < 1)
		{
			throw new Error(`Page must be >= 1, received: ${page}`);
		}
	};

	validation.direction = (direction) =>
	{
		direction = String(direction).toLowerCase();

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
	};

	validation.value = (value) =>
	{
		if(value !== null && !['number', 'string', 'boolean'].includes(typeof value))
		{
			throw new Error(`Value must be string, number, or boolean. Got: ${typeof value}`);
		}
	};

	validation.between = (value) =>
	{
		if(!Array.isArray(value) || value.length !== 2)
		{
			throw new Error('BETWEEN requires array of exactly 2 elements.');
		}
	};

	validation.inList = (value) =>
	{
		if(!Array.isArray(value) || !value.length)
		{
			throw new Error('IN requires a non-empty array.');
		}
	};

	return validation;
});
