transforms.Fn('data', function(config, node)
{
    const data = {};

    Object.entries(config).forEach(([name, definition]) =>
    {
        name = name.toLowerCase();

        const attribute = 'ot-' + name;
        const raw = node.getAttribute(attribute);
        const value = raw !== null ? onetype.Function(raw, {}, false) : undefined;

        data[name] = onetype.DataDefineOne(typeof value === 'undefined' ? raw : value, definition);

        if(raw !== null)
        {
            node.removeAttribute(attribute);
        }
    });

    return data;
});
