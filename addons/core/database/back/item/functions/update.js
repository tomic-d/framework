import database from '#database/addon.js';

database.Fn('item.update', async function(item, connection = null)
{
    if(!connection)
    {
        connection = item.Get('connection');
    }

    const addon = item.addon;
    const table = addon.Table();

    if(!table.name)
    {
        throw new Error('Addon must have table name set.');
    }

    const fields = {};

    Object.values(addon.Fields().data).forEach((field) =>
    {
        if(field.name !== 'id')
        {
            try
            {
                const key = table.prefix ? table.prefix + field.name : field.name;
                fields[key] = item.Get(field.name);
            }
            catch(error)
            {
                throw new Error('Item Update GET Error. ' + error.message);
            }
        }
    });

    if(addon.FieldGet('updated'))
    {
        const updatedKey = table.prefix ? table.prefix + 'updated' : 'updated';
        fields[updatedKey] = new Date().toISOString();
    }

    if(addon.FieldGet('updated_at'))
    {
        const updatedKey = table.prefix ? table.prefix + 'updated_at' : 'updated_at';
        fields[updatedKey] = new Date().toISOString();
    }

    const key = table.prefix ? table.prefix + 'id' : 'id';

    return connection(table.name).where(key, item.Get('id')).update(fields).returning('*').then(([record]) =>
    {
        Object.entries(record).forEach(([key, value]) =>
        {
            try
            {
                if(value instanceof Date)
                {
                    value = value.toISOString();
                }

                if(table.prefix && key.startsWith(table.prefix))
                {
                    key = key.slice(table.prefix.length);
                }

                item.Set(key, value);
            }
            catch(error)
            {
                throw new Error('Item Update SET Error. ' + error.message);
            }
        });

        return item;
    });
});
