import database from '#database/addon.js';

database.Fn('item.create', async function(item, addon, connection = null)
{
    if(!connection)
    {
        connection = item.Get('connection');
    }

    const table = addon.Table();

    if(!table.name)
    {
        throw new Error('Addon must have table name set.');
    }

    const fields = {};
    const id = item.Get('id');

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
                throw new Error('Item Create GET Error. ' + error.message);
            }
        }
    });

    if(addon.FieldGet('updated'))
    {
        const updatedKey = table.prefix ? table.prefix + 'updated' : 'updated';
        fields[updatedKey] = new Date().toISOString();
    }

    if(addon.FieldGet('created'))
    {
        const createdKey = table.prefix ? table.prefix + 'created' : 'created';
        fields[createdKey] = new Date().toISOString();
    }

    if(addon.FieldGet('updated_at'))
    {
        const updatedKey = table.prefix ? table.prefix + 'updated_at' : 'updated_at';
        fields[updatedKey] = new Date().toISOString();
    }

    if(addon.FieldGet('created_at'))
    {
        const createdKey = table.prefix ? table.prefix + 'created_at' : 'created_at';
        fields[createdKey] = new Date().toISOString();
    }

    return connection(table.name).insert(fields).returning('*').then(([record]) =>
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
                throw new Error('Item Create SET Error. ' + error.message);
            }
        });

        addon.ItemRemove(id, false);

        const created = addon.ItemAdd({id: item.Get('id')}, null, false);

        created.data = item.data;
        created.store = item.store;

        return created;
    });
});
