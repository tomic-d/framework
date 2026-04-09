transforms.Fn('data', function(config, node)
{
    const data = {};

    Object.entries(config).forEach(([name, definition]) =>
    {
        name = name.toLowerCase();

        const attribute = 'ot-' + name;
        const raw = node.getAttribute(attribute);
        let value = raw;

        if(raw !== null)
        {
            const type = Array.isArray(definition) ? definition[0] : (definition && definition.type);

            if(type !== 'string')
            {
                try
                {
                    const evaluated = onetype.Function(raw, {}, false);

                    if(evaluated !== undefined)
                    {
                        value = evaluated;
                    }
                }
                catch(e) {}
            }
        }

        data[name] = onetype.DataDefineOne(value, definition);

        if(raw !== null)
        {
            node.removeAttribute(attribute);
        }
    });

    return data;
});
