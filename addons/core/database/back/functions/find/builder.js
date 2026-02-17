import database from '#database/addon.js';

database.Fn('find.builder', function()
{
    const builder = {};
    
    builder.applyFilters = (knexQuery, filters) =>
    {
        if(!filters.length)
        {
            return;
        }
        
        const groups = {};

        filters.forEach(filter => 
        {
            if(!groups[filter.group])
            {
                groups[filter.group] = { type: 'AND', filters: [] };
            }
            
            if(filter.groupStart)
            {
                groups[filter.group].type = filter.type;
            }
            else
            {
                groups[filter.group].filters.push(filter);
            }
        });
        
        knexQuery.where(function()
        {
            let first = true;
            
            Object.entries(groups).forEach(([groupId, group]) => 
            {
                if(!group.filters.length)
                {
                    return;
                }
                
                const method = first ? 'where' : (group.type === 'OR' ? 'orWhere' : 'andWhere');
                first = false;
                
                this[method](function()
                {
                    group.filters.forEach((filter, i) => 
                    {
                        builder.applyFilter(this, filter, i);
                    });
                });
            });
        });
    };
    
    builder.applyFilter = (query, filter, index) =>
    {
        const method = index === 0 ? 'where' : (filter.type === 'OR' ? 'orWhere' : 'where');
        const operator = filter.operator.toUpperCase();
        
        if(operator === 'NULL')
        {
            query[method + 'Null'](filter.field);
        }
        else if(operator === 'NOT NULL')
        {
            query[method + 'NotNull'](filter.field);
        }
        else if(operator === 'BETWEEN')
        {
            query[method + 'Between'](filter.field, filter.value);
        }
        else if(operator === 'NOT BETWEEN')
        {
            query[method + 'NotBetween'](filter.field, filter.value);
        }
        else if(operator === 'CONTAINS')
        {
            const val = Array.isArray(filter.value) ? filter.value : [filter.value];
            const type = typeof val[0] === 'number' ? '::int[]' : '::varchar[]';
            query.whereRaw(`?? @> ARRAY[${val.map(() => '?').join(',')}]${type}`, [filter.field, ...val]);
        }
        else if(operator === 'CONTAINED')
        {
            const val = Array.isArray(filter.value) ? filter.value : [filter.value];
            const type = typeof val[0] === 'number' ? '::int[]' : '::varchar[]';
            query.whereRaw(`?? <@ ARRAY[${val.map(() => '?').join(',')}]${type}`, [filter.field, ...val]);
        }
        else if(operator === 'HAS')
        {
            query.whereRaw(`?? ? ?`, [filter.field, filter.value]);
        }
        else if(['IN', 'NOT IN'].includes(operator))
        {
            const values = Array.isArray(filter.value) ? filter.value : [filter.value];
            query[method](filter.field, operatorToKnex(operator), values);
        }
        else
        {
            query[method](filter.field, operatorToKnex(operator), filter.value);
        }
    };
    
    const operatorToKnex = (operator) =>
    {
        const map = {
            'EQUALS': '=',
            'NOT EQUALS': '!=',
            'LESS': '<',
            'GREATER': '>',
            'LESS EQUALS': '<=',
            'GREATER EQUALS': '>=',
            'LIKE': 'like',
            'NOT LIKE': 'not like',
            'ILIKE': 'ilike',
            'NOT ILIKE': 'not ilike',
            'IN': 'in',
            'NOT IN': 'not in'
        };
        
        return map[operator] || operator.toLowerCase();
    };
    
    builder.applySort = (knexQuery, sort) =>
    {
        if(sort)
        {
            knexQuery.orderBy(sort.field, sort.direction);
        }
    };
    
    builder.applyPagination = (knexQuery, limit, page) =>
    {
        if(limit > 0)
        {
            knexQuery.limit(limit);

            if(page > 1)
            {
                knexQuery.offset((page - 1) * limit);
            }
        }
    };
    
    builder.applySelect = (knexQuery, select, distinct) =>
    {
        if(select)
        {
            knexQuery[distinct ? 'distinct' : 'select'](select);
        }
        else
        {
            knexQuery[distinct ? 'distinct' : 'select']('*');
        }
    };
    
    return builder;
});