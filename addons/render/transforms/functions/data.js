transforms.Fn('data', function(config, node)
{
    const data = {};

    Object.entries(config).forEach(([name, definition]) =>
    {
        name = name.toLowerCase();

        const raw = node.getAttribute(name);
        const value = raw !== null ? onetype.Function(raw, {}, false) : raw;

        data[name] = onetype.DataDefineOne(value, definition);

        if(raw !== null)
        {
            node.removeAttribute(name);
        }
    });

    return data;
});
