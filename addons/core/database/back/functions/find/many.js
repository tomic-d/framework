import divhunt from '#framework/load.js';
import database from '#database/addon.js';

database.Fn('find.many', async function(query, set = false)
{
    const builder = database.Fn('find.builder');
    const knexQuery = query.connection(query.table.name);

    builder.applySelect(knexQuery, query.select, query.distinct);
    builder.applyFilters(knexQuery, query.filters);
    builder.applySort(knexQuery, query.sort);
    builder.applyPagination(knexQuery, query.limit, query.page);

    const result = await knexQuery;

    const items = result.map((record) =>
    {
        const data = {};

        Object.entries(record).forEach(([key, value]) =>
        {
            if(value instanceof Date)
            {
                value = value.toISOString();
            }

            if(query.table.prefix && key.startsWith(query.table.prefix))
            {
                key = key.slice(query.table.prefix.length);
            }

            data[key] = value;
        });

        return query.addon.ItemAdd(data, null, false, set);
    });

    if(query.joins.length)
    {
        for(const join of query.joins)
        {
            const addon = divhunt.AddonGet(join.addon);

            if(!addon)
            {
                throw new Error(`Join addon '${join.addon}' not found`);
            }

            const ids = [];

            items.forEach(item =>
            {
                const value = item.Get(join.field);

                if(join.many && Array.isArray(value))
                {
                    value.forEach(id => { if(id && !ids.includes(id)) ids.push(id); });
                }
                else if(value && !ids.includes(value))
                {
                    ids.push(value);
                }
            });

            if(!ids.length)
            {
                continue;
            }

            const joined = await addon.Find(query.connection).filter('id', ids, 'IN').limit(ids.length).many();
            const map = {};

            const fields = Object.keys(addon.Fields().data);
            joined.forEach(item => { map[String(item.Get('id'))] = item.Get(fields); });

            items.forEach(item =>
            {
                const value = item.Get(join.field);

                if(join.many && Array.isArray(value))
                {
                    item.Set(join.output, value.map(id => map[String(id)]).filter(Boolean));
                }
                else if(value)
                {
                    item.Set(join.output, map[String(value)] || null);
                }
            });
        }
    }

    return items;
});