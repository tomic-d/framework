import database from '#database/addon.js';

database.Fn('find', function(connection, table, addon)
{
    const query = {
        filters: [],
        joins: [],
        sort: null,
        limit: 10,
        page: 1,
        distinct: false,
        select: null,
        table,
        addon,
        connection,
        operators: [
            'EQUALS', 'NOT EQUALS', 'LESS', 'GREATER', 'LESS EQUALS', 'GREATER EQUALS', 
            'LIKE', 'NOT LIKE', 'ILIKE', 'NOT ILIKE', 'IN', 'NOT IN', 
            'BETWEEN', 'NOT BETWEEN', 'NULL', 'NOT NULL', 
            'CONTAINS', 'CONTAINED', 'HAS'
        ]
    };

    return database.Fn('find.methods', query);
});