directives.Fn('process.attributes', function(node, compile)
{
    if(node.nodeType !== Node.ELEMENT_NODE || !node.__attributes)
    {
        return;
    }

    if(!node.__attributes.some(attr => attr.name.startsWith(':')))
    {
        return;
    }

    const tag = node.tagName.toLowerCase();

    node.__attributes.forEach(attribute =>
    {
        if (!attribute.name.startsWith(':'))
        {
            return;
        }

        const attributeName = attribute.name.substring(1);
        const expression = attribute.value;

        try
        {
            const value = onetype.Function(expression, compile.data, false);

            if (value === null || value === undefined || value === false)
            {
                node.removeAttribute(attributeName);
            }
            else if (value === true)
            {
                node.setAttribute(attributeName, '');
            }
            else if (typeof value === 'string' || typeof value === 'number')
            {
                node.setAttribute(attributeName, value);
            }
            else
            {
                node.removeAttribute(attributeName);
            }

            node.removeAttribute(attribute.name);
        }
        catch(error)
        {
            onetype.Error(500, '<:tag:> :attribute: — :reason:', {tag, attribute: attributeName, reason: error.message, expression});
            node.removeAttribute(attribute.name);
        }
    });
});
