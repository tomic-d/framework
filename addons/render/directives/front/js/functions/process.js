directives.Fn('process', function(trigger, item, compile, node, identifier)
{
    if (!node)
    {
        return;
    }

    if(!directives.StoreHas('sorted'))
    {
        directives.StoreSet('sorted', Object.values(directives.Items()).sort((a, b) => a.Get('order') - b.Get('order')).map(directive => ({
            item: directive,
            trigger: directive.Get('trigger'),
            type: directive.Get('type'),
            tag: directive.Get('tag'),
            attributes: directive.Get('attributes'),
            strict: directive.Get('strict'),
            code: directive.Get('code')
        })));

        directives.StoreSet('fn.match', directives.FnGet('process.match').callback);
        directives.StoreSet('fn.data', directives.FnGet('process.data').callback);
        directives.StoreSet('fn.attributes', directives.FnGet('process.attributes').callback);
    }

    if(node.nodeType === 1)
    {
        if(!node.attributes.length && !node.tagName.includes('-'))
        {
            return;
        }

        if(node.attributes.length && !node.__attributes)
        {
            node.__attributes = Array.from(node.attributes).map(attr => ({
                name: attr.name,
                lowerName: attr.name.toLowerCase(),
                value: attr.value,
                original: attr
            }));
        }
    }
    else if(node.nodeType !== 3)
    {
        return;
    }

    const items = directives.StoreGet('sorted');
    const match = directives.StoreGet('fn.match');
    const data = directives.StoreGet('fn.data');

    for (let i = 0; i < items.length; i++)
    {
        const directive = items[i];

        if(directive.trigger !== trigger)
        {
            continue;
        }

        if(node.nodeType === 3 && directive.type !== '3')
        {
            continue;
        }

        if(!match(directive, node))
        {
            continue;
        }

        const attributes = data(directive.attributes, node, compile);

        try
        {
            const result = directive.code.call({}, attributes, item, compile, node, identifier);

            if(result === false)
            {
                break;
            }
        }
        catch (error)
        {
            console.error('Directive processing error:', error);
        }
    }

    directives.StoreGet('fn.attributes')(node, compile);
});