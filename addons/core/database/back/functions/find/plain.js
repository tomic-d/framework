import database from '#database/addon.js';

database.Fn('find.plain', async function(query)
{
    const builder = database.Fn('find.builder');
    const countQuery = query.connection(query.table.name).count('* as count');

    builder.applyFilters(countQuery, query.filters);

    const [items, countResult] = await Promise.all([
        database.Fn('find.many', query),
        countQuery
    ]);

    const total = parseInt(countResult[0]?.count || 0);
    const fields = Object.keys(query.addon.Fields().data);

    return {
        items: items.map(item => item.Get(fields)),
        total,
        page: query.page,
        pages: query.limit > 0 ? Math.ceil(total / query.limit) : 1,
        limit: query.limit
    };
});
