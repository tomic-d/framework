import database from '#database/addon.js';

database.Fn('find.filter', function(query, field, value, operator, type, group, returnMethods)
{
    const validation = database.Fn('find.validation');
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
    
    if(query.table.prefix)
    {
        field = query.table.prefix + field;
    }

    query.filters.push({ field, value, operator: normalizedOperator, type, group });
    return returnMethods;
});
