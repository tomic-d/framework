import database from '#database/addon.js';

database.Fn('find.validation', function()
{
    const validation = {};
    
    validation.field = field =>
    {
        if (field === undefined || field === null)
        {
            throw new Error('Field name cannot be null or undefined');
        }
        
        if (typeof field !== 'string')
        {
            throw new Error(`Field name must be a string, received: ${typeof field}`);
        }
        
        if (!(/^[a-zA-Z][a-zA-Z0-9_\.]{0,63}$/.test(field)))
        {
            throw new Error(`Invalid field name format: '${field}'. Must start with a letter and contain only letters, numbers, underscores, and dots. Maximum length is 64 characters.`);
        }

        return true;
    };
    
    validation.fields = fields =>
    {
        if (!Array.isArray(fields))
        {
            throw new Error(`Fields must be an array, received: ${typeof fields}`);
        }
        
        if (fields.length === 0)
        {
            throw new Error('Fields array cannot be empty');
        }
        
        for (let i = 0; i < fields.length; i++)
        {
            try
            {
                validation.field(fields[i]);
            }
            catch (error)
            {
                throw new Error(`Invalid field at index ${i}: ${error.message}`);
            }
        }
        
        return true;
    };
    
    validation.limit = limit =>
    {
        if (limit === undefined || limit === null)
        {
            throw new Error('Limit cannot be null or undefined');
        }
        
        if (typeof limit !== 'number')
        {
            throw new Error(`Limit must be a number, received: ${typeof limit}`);
        }
        
        if (!Number.isInteger(limit))
        {
            throw new Error('Limit must be an integer');
        }
        
        if (limit <= 0)
        {
            throw new Error(`Limit must be a positive number, received: ${limit}`);
        }

        return true;
    };
    
    validation.page = page =>
    {
        if (page === undefined || page === null)
        {
            throw new Error('Page cannot be null or undefined');
        }
        
        if (typeof page !== 'number')
        {
            throw new Error(`Page must be a number, received: ${typeof page}`);
        }
        
        if (!Number.isInteger(page))
        {
            throw new Error('Page must be an integer');
        }
        
        if (page < 1)
        {
            throw new Error(`Page must be greater than 0, received: ${page}`);
        }

        return true;
    };
    
    validation.direction = direction =>
    {
        if (direction === undefined || direction === null)
        {
            throw new Error('Sort direction cannot be null or undefined');
        }
        
        if (typeof direction !== 'string')
        {
            throw new Error(`Sort direction must be a string, received: ${typeof direction}`);
        }
        
        direction = direction.toLowerCase();
        
        if (!['asc', 'desc'].includes(direction))
        {
            throw new Error(`Invalid sort direction: '${direction}'. Must be either 'asc' or 'desc'`);
        }

        return direction;
    };
    
    validation.operator = (operator, operators) =>
    {
        if (operator === undefined || operator === null)
        {
            throw new Error('Operator cannot be null or undefined');
        }
        
        if (typeof operator !== 'string')
        {
            throw new Error(`Operator must be a string, received: ${typeof operator}`);
        }
        
        if (!operators || !Array.isArray(operators) || operators.length === 0)
        {
            throw new Error('Invalid operators list');
        }
        
        const normalizedOperator = operator.toUpperCase();
        const normalizedOperators = operators.map(op => typeof op === 'string' ? op.toUpperCase() : op);
        
        if (!normalizedOperators.includes(normalizedOperator))
        {
            throw new Error(`Invalid operator: '${operator}'. Allowed operators are: ${operators.join(', ')}`);
        }

        return true;
    };
    
    validation.value = value =>
    {
        const validTypes = ['number', 'string', 'boolean'];
        
        if (value !== null && !validTypes.includes(typeof value))
        {
            throw new Error(`Value must be a string, number, boolean. Received: ${value === undefined ? 'undefined' : typeof value}`);
        }
        
        return true;
    };
    
    validation.between = value =>
    {
        if (!Array.isArray(value))
        {
            throw new Error(`Value for BETWEEN operator must be an array, received: ${typeof value}`);
        }
        
        if (value.length !== 2)
        {
            throw new Error(`Value for BETWEEN operator must have exactly 2 elements, found: ${value.length}`);
        }
        
        if (value[0] === undefined || value[1] === undefined)
        {
            throw new Error('BETWEEN values cannot contain undefined');
        }

        return true;
    };
    
    validation.inList = value =>
    {
        if (!Array.isArray(value))
        {
            throw new Error(`Value for IN operator must be an array, received: ${typeof value}`);
        }
        
        if (value.length === 0)
        {
            throw new Error('IN operator requires a non-empty array');
        }
        
        for (let i = 0; i < value.length; i++)
        {
            try
            {
                validation.value(value[i]);
            }
            catch (error)
            {
                throw new Error(`Invalid value at index ${i} for IN operator: ${error.message}`);
            }
        }
        
        return true;
    };
    
    return validation;
});