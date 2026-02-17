directives.Fn('process', function(trigger, item, compile, node, identifier)
{
    if (!node)
    {
        return;
    }

    if(!directives.StoreHas('sorted'))
    {
        directives.StoreSet('sorted', Object.values(directives.Items()).sort((a, b) => a.Get('order') - b.Get('order')));
    }

    if(node.attributes && !node.__attributes)
    {
        node.__attributes = Array.from(node.attributes).map(attr => ({
            name: attr.name,
            lowerName: attr.name.toLowerCase(),
            value: attr.value,
            original: attr
        }));
    }

    const items = directives.StoreGet('sorted');

    for (let i = 0; i < items.length; i++)
    {
        const directive = items[i];

        if (directive.Get('trigger') !== trigger)
        {
            continue;
        }

        if (!directives.Fn('process.match', directive, node))
        {
            continue;
        }

        const data = directives.Fn('process.data', directive.Get('attributes'), node, compile);

        try
        {
            const result = directive.Get('code').call({}, data, item, compile, node, identifier);

            if (result === false)
            {
                break;
            }
        }
        catch (error)
        {
            console.error('Directive processing error:', error);
        }
    }

    directives.Fn('process.attributes', node, compile);
});