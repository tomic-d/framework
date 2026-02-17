directives.Fn('process.match', function(directive, node)
{   
    const tag = directive.Get('tag');
    const type = directive.Get('type');
    const attributes = directive.Get('attributes');

    const matches = {
        count: 0,
        total: Object.keys(attributes).length + (tag ? 1 : 0) + (type ? 1 : 0),
    };

    if (tag && node.tagName && node.tagName.toLowerCase() === tag.toLowerCase())
    {
        matches.count++;
    }

    if (type && node.nodeType.toString() === type)
    {
        matches.count++;
    }

    Object.entries(attributes).forEach(([name]) =>
    {
        name = name.toLowerCase();

        const find = node.__attributes && node.__attributes.some(attribute =>
        {
            return (attribute.lowerName === name) || attribute.lowerName === (':' + name) || attribute.lowerName.startsWith(name + '.') || attribute.lowerName.startsWith(':' + name + '.');
        });

        if(find)
        {
            matches.count++;
        }
    });

    if(directive.Get('strict'))
    {
        return matches.count === matches.total && matches.total > 0;
    }

    return matches.count > 0;
});