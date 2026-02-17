import database from '#database/addon.js';

database.Fn('find.count', async function(query)
{
    const builder = database.Fn('find.builder');
    const knexQuery = query.connection(query.table.name).count('* as count');
    
    builder.applyFilters(knexQuery, query.filters);

    const result = await knexQuery;
    return parseInt(result[0]?.count || 0);
});
