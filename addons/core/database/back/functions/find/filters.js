import database from '#database/addon.js';

database.Fn('find.filters', function(knexQuery, filters = [])
{
    const builder = database.Fn('find.builder');
    builder.applyFilters(knexQuery, filters);
});
