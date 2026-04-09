import database from '#database/addon.js';

database.Fn('items.filter', function(query, field, value, operator, type, group, returnMethods)
{
	const validation = database.Fn('items.validation');
	const normalizedOperator = operator.toUpperCase();

	if(normalizedOperator === 'NULL' || normalizedOperator === 'NOT NULL')
	{
		validation.field(field);
	}
	else if(normalizedOperator === 'BETWEEN' || normalizedOperator === 'NOT BETWEEN')
	{
		validation.field(field);
		validation.between(value);
	}
	else if(normalizedOperator === 'IN' || normalizedOperator === 'NOT IN')
	{
		validation.field(field);
		validation.operator(normalizedOperator, query.operators.map(op => op.toUpperCase()));
		validation.inList(value);
	}
	else
	{
		validation.field(field);
		validation.operator(normalizedOperator, query.operators.map(op => op.toUpperCase()));
		validation.value(value);
	}

	query.filters.push({ field, value, operator: normalizedOperator, type, group });
	return returnMethods;
});
