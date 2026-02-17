import divhunt from '#framework/load.js';
import database from '#database/addon.js';

database.Fn('find.methods', function(query, context = null, groupId = 'default')
{
    const validation = database.Fn('find.validation');
    const methods = {};
    
    methods.limit = limit =>
    {
        try
        {
            validation.limit(limit);
            query.limit = limit;
            return methods;
        }
        catch (error)
        {
            throw new Error(`Invalid limit parameter: ${error.message}`);
        }
    };
    
    methods.page = page =>
    {
        try
        {
            validation.page(page);
            query.page = page;
            return methods;
        }
        catch (error)
        {
            throw new Error(`Invalid page parameter: ${error.message}`);
        }
    };
    
    methods.sort = (field, direction = 'asc') =>
    {
        try
        {
            validation.field(field);
            direction = validation.direction(direction);

            if(query.table.prefix)
            {
                field = query.table.prefix + field;
            }

            query.sort = { field, direction };
            return methods;
        }
        catch (error)
        {
            throw new Error(`Invalid sort parameters: ${error.message}`);
        }
    };
    
    methods.select = fields =>
    {
        try
        {
            if (fields === undefined || fields === null)
            {
                throw new Error('Fields parameter cannot be null or undefined');
            }

            fields = Array.isArray(fields) ? fields : [fields];
            validation.fields(fields);

            if(query.table.prefix)
            {
                fields = fields.map(f => query.table.prefix + f);
            }

            query.select = fields;
            return methods;
        }
        catch (error)
        {
            throw new Error(`Invalid select parameters: ${error.message}`);
        }
    };
    
    methods.distinct = (value = true) =>
    {
        query.distinct = Boolean(value);
        return methods;
    };
    
    methods.filter = (field, value, operator = 'EQUALS') => 
    {
        try
        {
            return database.Fn('find.filter', query, field, value, operator, 'AND', groupId, methods);
        }
        catch (error)
        {
            throw new Error(`Filter error for field '${field}': ${error.message}`);
        }
    };

    methods.orFilter = (field, value, operator = 'EQUALS') => 
    {
        try 
        {
            return database.Fn('find.filter', query, field, value, operator, 'OR', groupId, methods);
        }
        catch (error)
        {
            throw new Error(`OR filter error for field '${field}': ${error.message}`);
        }
    };
    
    methods.group = (type = 'AND') =>
    {
        try
        {
            if (type !== 'AND' && type !== 'OR')
            {
                throw new Error(`Group type must be 'AND' or 'OR', received: ${type}`);
            }
            
            const TID = divhunt.GenerateTID();
            
            if (!query.filters)
            {
                query.filters = [];
            }
            
            query.filters.push({ groupStart: true, group: TID, type });
            
            const groupMethods = database.Fn('find.methods', query, methods, TID);
            groupMethods.end = () => context || methods;
            
            return groupMethods;
        }
        catch (error)
        {
            throw new Error(`Error creating filter group: ${error.message}`);
        }
    };
    
    methods.join = (addon, field, output = null) =>
    {
        try
        {
            const config = query.addon.FieldGet(field);

            if(!config)
            {
                throw new Error(`Field '${field}' not found in addon`);
            }

            const parsed = divhunt.DataParseConfig(config.define);
            const many = parsed.type.includes('array');

            query.joins.push({ addon, field, output: output || field, many });

            return methods;
        }
        catch (error)
        {
            throw new Error(`Join error for field '${field}': ${error.message}`);
        }
    };

    methods.many = async (set = false) =>
    {
        try
        {
            return database.Fn('find.many', query, set);
        }
        catch (error)
        {
            throw new Error(`Error executing 'many' query: ${error.message}`);
        }
    };

    methods.plain = async () =>
    {
        try
        {
            return database.Fn('find.plain', query);
        }
        catch (error)
        {
            throw new Error(`Error executing 'plain' query: ${error.message}`);
        }
    };
    
    methods.count = async () =>
    {
        try
        {
            return database.Fn('find.count', query);
        }
        catch (error)
        {
            throw new Error(`Error executing 'count' query: ${error.message}`);
        }
    };
    
    methods.one = async (set = false) =>
    {
        try
        {
            const results = await methods.limit(1).many(set);
            return results.length > 0 ? results[0] : null;
        }
        catch (error)
        {
            throw new Error(`Error executing 'one' query: ${error.message}`);
        }
    };
    
    methods.exists = async () =>
    {
        try
        {
            const count = await methods.limit(1).count();
            return count > 0;
        }
        catch (error)
        {
            throw new Error(`Error executing 'exists' query: ${error.message}`);
        }
    };
    
    if(context) 
    {
        methods.end = () => context;
    }
    
    return methods;
});